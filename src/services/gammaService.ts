import type { UserId } from 'gammait'

import { createGammaClientApi } from '@/lib/gamma'

export default class GammaService {
    /**
     * Check if the user is an administrator.
     * @param userId The Gamma user ID.
     * @returns If the user is an admin.
     */
    static async isAdmin(userId: UserId): Promise<boolean> {
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
}
