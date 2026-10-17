import { fromBase64 } from '@exodus/bytes/base64.js'
import * as gamma from 'gammait'
import { userAvatarUrl } from 'gammait/urls'
import { route, routeOperation } from 'next-rest-framework'
import z from 'zod'

import type {
    ApiClientJwtPayload,
    JwtWithToken,
    UserJwtPayload,
} from '@/lib/tokenDefinitions'

import {
    ApiError,
    createApiErrorOutputs,
    createJwtResponse,
    type ApiErrorTypes,
    type JsonResponseType,
} from '@/lib/api/responses'
import { TokenResponse } from '@/lib/api/schemas'
import { checkClientSecret, getApiClientWithSecretHash } from '@/lib/client'
import { createGammaAuthorizationCode } from '@/lib/gamma'
import { signApiClientJwtPayload, signUserJwtPayload } from '@/lib/token'

export const AuthorizationCodeRequestBody = z.object({
    grant_type: z.literal('authorization_code'),
    code: z.string(),
})
export type AuthorizationCodeRequestBody = z.infer<
    typeof AuthorizationCodeRequestBody
>

export const ClientCredentialsRequestBody = z.object({
    grant_type: z.literal('client_credentials'),
    client_id: z.uuidv4().optional(),
    client_secret: z.string().optional(),
})
export type ClientCredentialsRequestBody = z.infer<
    typeof ClientCredentialsRequestBody
>

export const TokenRequestBody = AuthorizationCodeRequestBody.or(
    ClientCredentialsRequestBody
)
export type TokenRequestBody = z.infer<typeof TokenRequestBody>

export const { POST } = route({
    token: routeOperation({
        method: 'POST',
    })
        .input({
            body: TokenRequestBody,
        })
        .outputs([
            {
                status: 200,
                contentType: 'application/json',
                body: TokenResponse,
            },
            ...createApiErrorOutputs([400, 401, 500, 502, 504] as const),
        ])
        .handler(async req => {
            let body: TokenRequestBody
            const contentType = req.headers.get('Content-Type')
            if (contentType === 'application/x-www-form-urlencoded') {
                const formData = await req.formData()
                const formDataObject = Object.fromEntries(formData.entries())
                body = TokenRequestBody.parse(formDataObject)
            } else if (contentType === 'application/json') {
                body = TokenRequestBody.parse(await req.json())
            } else {
                return ApiError.unsupportedBodyType
            }

            const grantType = body.grant_type
            if (grantType === 'authorization_code') {
                return await authorizationCodeFlow(body)
            } else if (grantType === 'client_credentials') {
                let credentials: BasicCredentials
                if (
                    body.client_id == undefined ||
                    body.client_secret == undefined
                ) {
                    const authorizationHeader = req.headers.get('Authorization')
                    if (!authorizationHeader) {
                        return ApiError.missingCredentials
                    }
                    credentials =
                        decodeBasicAuthorizationHeader(authorizationHeader)
                } else {
                    credentials = {
                        username: body.client_id,
                        password: body.client_secret,
                    }
                }
                return await clientCredentialsFlow(credentials)
            }

            return ApiError.invalidGrantType
        }),
})

async function authorizationCodeFlow(
    body: AuthorizationCodeRequestBody
): Promise<
    | ApiErrorTypes<[401, 500, 502, 504]>
    | JsonResponseType<JwtWithToken & UserJwtPayload>
> {
    // Get token from Gamma
    const authorizationCode = createGammaAuthorizationCode()
    try {
        await authorizationCode.generateToken(body.code)
    } catch (error) {
        const unreachable =
            (error as NodeJS.ErrnoException)?.code === 'ENOTFOUND' ||
            (error as NodeJS.ErrnoException)?.code === 'ECONNREFUSED'
        if (unreachable) {
            console.warn('Unable to reach Gamma when logging in user:', error)
            return ApiError.gammaUnreachable
        }
        console.error('Failed to get token from Gamma:', error)
        if (error instanceof Error && error.message.includes('400')) {
            return ApiError.usedAuthorizationCode
        }
        return ApiError.gammaFailedToken
    }

    let userInfo: gamma.UserInfo
    try {
        userInfo = await authorizationCode.userInfo()
    } catch (error) {
        if (
            (error as NodeJS.ErrnoException).code === 'ENOTFOUND' ||
            (error as NodeJS.ErrnoException).code === 'ECONNREFUSED'
        ) {
            return ApiError.gammaUnreachable
        }
        console.error('Failed to fetch Gamma info for login:', error)
        return ApiError.unexpected
    }

    try {
        const jwt = await signUserJwtPayload({
            sub: userInfo.sub,
            nickname: userInfo.nickname,
            picture: userAvatarUrl(userInfo.sub),
        })

        return createJwtResponse(jwt)
    } catch (error) {
        console.error('Failed to create JWT:', error)
        return ApiError.createJwtFailed
    }
}

type BasicCredentials = {
    username: string
    password: string
}

/**
 * Decode the basic authorization header.
 * @param authorizationHeader The encoded authorization header
 * @returns The username and password as an array containing the elements in that order.
 * @throws If the authorization header is invalid.
 */
function decodeBasicAuthorizationHeader(
    authorizationHeader: string
): BasicCredentials {
    try {
        const basic = authorizationHeader.split(' ')[1]
        const decoder = new TextDecoder('utf8')
        const decoded: string = decoder.decode(fromBase64(basic))
        const [clientId, clientSecret] = decoded.split(':')
        return { username: clientId, password: clientSecret }
    } catch {
        throw new Error('Authorization header is invalid')
    }
}

async function clientCredentialsFlow(
    credentials: BasicCredentials
): Promise<
    | ApiErrorTypes<[401, 500]>
    | JsonResponseType<JwtWithToken & ApiClientJwtPayload>
> {
    const { username: clientId, password: clientSecret } = credentials

    // Check secret
    const client = await getApiClientWithSecretHash(clientId)
    if (!client) {
        return ApiError.invalidCredentials
    }

    const isCorrectSecret = await checkClientSecret(
        clientSecret,
        client.secretHash,
        client.salt
    )
    if (!isCorrectSecret) {
        return ApiError.invalidCredentials
    }

    // Sign token
    try {
        const jwt = await signApiClientJwtPayload({
            sub: client.id,
            scope: client.scope,
        })
        return createJwtResponse(jwt)
    } catch (error) {
        console.error('Failed to create session:', error)
        return ApiError.createSessionFailed
    }
}
