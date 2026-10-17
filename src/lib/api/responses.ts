import { TypedNextResponse } from 'next-rest-framework'
import z from 'zod'

import type { JwtWithToken } from '@/lib/tokenDefinitions'

export type ApiErrorType<
    T extends number,
    S extends string = string,
> = ReturnType<
    typeof TypedNextResponse.json<
        { error: { message: S; code: T } },
        T,
        'application/json'
    >
>

export type ApiErrorTypes<Tuple extends [...number[]]> = {
    [Index in keyof Tuple]: ApiErrorType<Tuple[Index]>
}[number]

function createApiError<T extends number, S extends string = string>(
    status: T,
    message: S
): ApiErrorType<T, S> {
    return TypedNextResponse.json(
        { error: { message, code: status } },
        { status }
    )
}

export type TypedNextResponseType<
    Body,
    Status extends number,
    ContentType extends string,
> = ReturnType<typeof TypedNextResponse.json<Body, Status, ContentType>>

export type JsonResponseType<
    Body extends object,
    Status extends number = 200,
> = TypedNextResponseType<Body, Status, 'application/json'>

export function createJwtResponse<T extends JwtWithToken>(
    jwt: T
): JsonResponseType<T, 200> {
    return TypedNextResponse.json(jwt, { status: 200 })
}

export class ApiError {
    static unexpected = createApiError(500, 'An unexpected error occurred')
    static unauthorized = createApiError(401, 'Unauthorized')
    static missingPermission = createApiError(
        403,
        'Missing permission to access this resource'
    )

    static invalidToken = createApiError(
        401,
        'Token is invalid, generate a new one'
    )
    static expiredToken = createApiError(401, 'Token is expired')
    static notBeforeToken = createApiError(401, 'Token cannot be used yet')

    static documentNotExist = createApiError(404, 'Document does not exist')
    static documentNoUploads = createApiError(404, 'Document has no uploads')

    static uploadNotExist = createApiError(404, 'Upload does not exist')

    static fileUploadOption = createApiError(
        400,
        'File upload option must be a file'
    )
    static uploadAlreadyExists = createApiError(
        409,
        'Uploaded file already exists'
    )
    static fileSaveFailed = createApiError(
        500,
        'Failed to save file, please try again later'
    )

    static unsupportedBodyType = createApiError(
        400,
        'Unsupported request body type'
    )
    static missingCredentials = createApiError(401, 'Missing credentials')
    static invalidCredentials = createApiError(401, 'Invalid credentials')
    static invalidGrantType = createApiError(400, 'Invalid grant type')
    static gammaUnreachable = createApiError(504, 'Gamma is unreachable')
    static usedAuthorizationCode = createApiError(
        401,
        'Authorization code has already been used'
    )
    static gammaFailedToken = createApiError(
        502,
        'Failed to get token from Gamma, your authorization code may be invalid'
    )
    static createJwtFailed = createApiError(500, 'Failed to create JWT')
    static createSessionFailed = createApiError(500, 'Failed to create session')
}

type ApiErrorOutput<T extends number> = {
    readonly status: T
    readonly contentType: 'application/json'
    readonly body: z.ZodObject<
        {
            error: z.ZodObject<
                {
                    message: z.ZodString
                    code: z.ZodLiteral<T>
                },
                z.core.$strip
            >
        },
        z.core.$strip
    >
}

type ApiErrorOutputs<Tuple extends [...number[]]> = {
    [Index in keyof Tuple]: ApiErrorOutput<Tuple[Index]>
} & { length: Tuple['length'] }

export function createApiErrorOutputs<T extends [...number[]]>(
    statusCodes: T
): ApiErrorOutputs<T> {
    return statusCodes.map((status: T[number]) => ({
        status: status,
        contentType: 'application/json',
        body: z.object({
            error: z.object({
                message: z.string(),
                code: z.literal(status),
            }),
        }),
    })) as ApiErrorOutputs<T>
}
