import 'server-only'
import { cookies } from 'next/headers'

import { env } from '@/environment'
import { STATE_COOKIE } from '@/lib/tokenDefinitions'

/** Time before a state expires in milliseconds. */
const stateExpireAfter = 10 * 60 * 1000 // 10 minutes in milliseconds

export default class StateService {
    static async generateAndStoreRandomState(): Promise<string> {
        const randomState = crypto.getRandomValues(new Uint8Array(32))
        const encodedState = Buffer.from(randomState).toString('base64url')

        const expiresAt = new Date(Date.now() + stateExpireAfter)

        // Store the state in a cookie
        const cookieStore = await cookies()
        cookieStore.set(STATE_COOKIE, encodedState, {
            httpOnly: true,
            secure: env.NODE_ENV !== 'development',
            expires: expiresAt,
            sameSite: 'lax',
            path: '/',
        })

        return encodedState
    }

    static async readState(): Promise<string | null> {
        const cookieStore = await cookies()
        const cookie = cookieStore.get(STATE_COOKIE)
        return cookie?.value ?? null
    }

    static async deleteState(): Promise<void> {
        const cookieStore = await cookies()
        cookieStore.delete(STATE_COOKIE)
    }
}
