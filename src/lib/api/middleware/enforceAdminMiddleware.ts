import gamma from 'gammait'

import type { TokenContext } from '@/lib/tokenDefinitions'

import { isApiClientJwtPayload, isUserJwtPayload } from '@/lib/tokenDefinitions'
import GammaService from '@/services/gammaService'

import { ApiError, type ApiErrorType } from '../responses'

export default async function enforceAdminMiddleware(
    _req: unknown,
    _ctx: unknown,
    middlewareContext: TokenContext
): Promise<ApiErrorType<403> | TokenContext> {
    const { token } = middlewareContext

    let admin = false
    if (isUserJwtPayload(token)) {
        admin = await GammaService.isAdmin(token.sub as gamma.UserId)
    } else if (isApiClientJwtPayload(token)) {
        admin = false
    }

    if (!admin) {
        return ApiError.missingPermission
    }

    return middlewareContext
}
