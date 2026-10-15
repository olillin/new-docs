import { AuthorizationCode, ClientApi, type UserId } from 'gammait'

import { env } from '@/lib/env'

import { createAbsoluteUrl } from './url'

export function createGammaAuthorizationCode(): AuthorizationCode {
    const redirectUri: string =
        env.GAMMA_REDIRECT_URI ?? createAbsoluteUrl('/callback').href

    return new AuthorizationCode({
        clientId: env.GAMMA_CLIENT_ID,
        clientSecret: env.GAMMA_CLIENT_SECRET,
        redirectUri,
        scope: ['openid', 'profile'],
    })
}

export function createGammaClientApi(): ClientApi {
    return new ClientApi({
        authorization: `pre-shared ${env.GAMMA_API_KEY_ID}:${env.GAMMA_API_KEY_SECRET}`,
    })
}

/**
 * Check if the user is an administrator.
 * @param userId The Gamma user ID.
 * @returns If the user is an admin.
 */
export async function isAdmin(userId: UserId): Promise<boolean> {
    const clientApi = createGammaClientApi()
    try {
        const authorities = await clientApi.getAuthoritiesFor(userId)
        return authorities.some(authority => authority.startsWith('admin'))
    } catch (error) {
        if (error instanceof Error) {
            console.warn(
                `Failed to fetch authorities from Gamma: ${String(error)}`
            )
        } else {
            console.warn('Failed to fetch authorities from Gamma')
        }
        return false
    }
}
