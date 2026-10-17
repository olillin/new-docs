import type { JwtPayload } from 'jsonwebtoken'
import type { NextRequest } from 'next/server'

import gamma from 'gammait'

import { isAdmin } from '../gamma'
import { verifyToken } from '../token'
import {
    ApiClientJwtPayload,
    isApiClientJwtPayload,
    isUserJwtPayload,
    SESSION_COOKIE,
    UserJwtPayload,
} from '../tokenDefinitions'
import { ApiError, type ApiErrorType } from './responses'

export type TokenContext = {
    token: (UserJwtPayload & JwtPayload) | (ApiClientJwtPayload & JwtPayload)
}

export function validateTokenMiddleware(
    req: NextRequest
): ApiErrorType<401> | TokenContext {
    const authorizationHeader = req.headers.get('Authorization')
    if (authorizationHeader) {
        const [tokenType, token] = authorizationHeader.split(' ')
        if (tokenType !== 'Bearer') {
            return ApiError.unauthorized
        }

        return createValidateTokenResponse(token)
    }

    const sessionCookie = req.cookies.get(SESSION_COOKIE)
    if (sessionCookie) {
        return createValidateTokenResponse(sessionCookie.value)
    }

    return ApiError.unauthorized
}

export function createValidateTokenResponse(
    token: string
): ApiErrorType<401> | TokenContext {
    try {
        const verifiedToken = verifyToken(token)

        const now = Date.now()
        if (verifiedToken.exp && now >= verifiedToken.exp * 1000) {
            return ApiError.expiredToken
        }
        if (verifiedToken.nbf && now < verifiedToken.nbf * 1000) {
            return ApiError.notBeforeToken
        }

        if (
            !isUserJwtPayload(verifiedToken) &&
            !isApiClientJwtPayload(verifiedToken)
        ) {
            return ApiError.invalidToken
        }

        // Authorize request
        return {
            token: verifiedToken,
        }
    } catch (e) {
        console.warn('Failed to verify token:', e)
        return ApiError.unauthorized
    }
}

export async function enforceAdminMiddleware(
    _req: unknown,
    _ctx: unknown,
    middlewareContext: TokenContext
): Promise<ApiErrorType<403> | TokenContext> {
    const { token } = middlewareContext

    let admin = false
    if (isUserJwtPayload(token)) {
        admin = await isAdmin(token.sub as gamma.UserId)
    } else if (isApiClientJwtPayload(token)) {
        admin = false
    }

    if (!admin) {
        return ApiError.missingPermission
    }

    return middlewareContext
}
