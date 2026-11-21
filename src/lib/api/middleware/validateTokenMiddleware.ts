import type { NextRequest } from 'next/server'

import { verifyToken } from '@/lib/token'
import {
    isApiClientJwtPayload,
    isUserJwtPayload,
    SESSION_COOKIE,
    type TokenContext,
} from '@/lib/tokenDefinitions'

import { ApiError, type ApiErrorType } from '../responses'

export default function validateTokenMiddleware(
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
