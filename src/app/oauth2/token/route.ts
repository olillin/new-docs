import type { NextResponse, NextRequest } from 'next/server'

import { fromBase64 } from '@exodus/bytes/base64.js'
import * as gamma from 'gammait'
import { userAvatarUrl } from 'gammait/urls'
import z from 'zod'

import { checkClientSecret, getApiClientWithSecretHash } from '@/lib/client'
import { createGammaAuthorizationCode } from '@/lib/gamma'
import { createApiError, createJwtResponse } from '@/lib/responses'
import { signApiClientJwtPayload, signUserJwtPayload } from '@/lib/token.js'

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

export default async function POST(
    request: NextRequest
): Promise<NextResponse> {
    const body = TokenRequestBody.parse(await request.json())

    const grantType = body.grant_type
    if (grantType === 'authorization_code') {
        return await authorizationCodeFlow(body)
    } else if (grantType === 'client_credentials') {
        let credentials: BasicCredentials
        if (body.client_id == undefined || body.client_secret == undefined) {
            const authorizationHeader = request.headers.get('Authorization')
            if (!authorizationHeader) {
                return createApiError(401, 'Missing credentials')
            }
            credentials = decodeBasicAuthorizationHeader(authorizationHeader)
        } else {
            credentials = {
                username: body.client_id,
                password: body.client_secret,
            }
        }
        return await clientCredentialsFlow(credentials)
    }

    return createApiError(400, 'Invalid grant_type')
}

async function authorizationCodeFlow(
    body: AuthorizationCodeRequestBody
): Promise<NextResponse> {
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
            return createApiError(504, 'Gamma is unreachable')
        }
        console.error('Failed to get token from Gamma:', error)
        if (error instanceof Error && error.message.includes('400')) {
            return createApiError(
                401,
                'Authorization code has already been used'
            )
        }
        return createApiError(
            502,
            'Failed to get token from Gamma, your authorization code may be invalid'
        )
    }

    let userInfo: gamma.UserInfo
    try {
        userInfo = await authorizationCode.userInfo()
    } catch (error) {
        if (
            (error as NodeJS.ErrnoException).code === 'ENOTFOUND' ||
            (error as NodeJS.ErrnoException).code === 'ECONNREFUSED'
        ) {
            return createApiError(504, 'Gamma is unreachable')
        }
        console.error('Failed to fetch Gamma info for login:', error)
        return createApiError(500, 'An unexpected error occurred')
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
        return createApiError(500, 'Failed to create JWT')
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
): Promise<NextResponse> {
    const { username: clientId, password: clientSecret } = credentials

    // Check secret
    const client = await getApiClientWithSecretHash(clientId)
    if (!client) {
        return createApiError(401, 'Invalid credentials')
    }

    const isCorrectSecret = await checkClientSecret(
        clientSecret,
        client.secretHash,
        client.salt
    )
    if (!isCorrectSecret) {
        return createApiError(401, 'Invalid credentials')
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
        return createApiError(500, 'Failed to create session')
    }
}
