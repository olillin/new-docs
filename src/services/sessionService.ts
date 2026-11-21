import 'server-only'
import gamma from 'gammait'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { connection } from 'next/server'
import { cache } from 'react'

import { env } from '@/environment'
import { verifyToken } from '@/lib/token'
import {
    isUserJwtPayload,
    SESSION_COOKIE,
    SessionInfo,
    type JwtWithToken,
} from '@/lib/tokenDefinitions'

import GammaService from './gammaService'

export default class SessionService {
    /**
     * Create a new session for an authenticated user and store in a cookie.
     * @param jwt The signed JWT.
     * @throws If the token does not have an expiration time.
     */
    static async createSession(jwt: JwtWithToken): Promise<void> {
        // Get expiration time
        if (jwt.exp === undefined) {
            throw new Error('Token does not have an expiration time')
        }
        const expiresAt = new Date(Date.now() + jwt.exp)
        // Store the session in a cookie
        const cookieStore = await cookies()
        cookieStore.set(SESSION_COOKIE, jwt.access_token, {
            httpOnly: true,
            secure: env.NODE_ENV !== 'development',
            expires: expiresAt,
            sameSite: 'lax',
            path: '/',
        })
    }

    /**
     * Get the session stored in cookies, or return null if missing or invalid.
     * @returns The session if it exists and is valid, else null.
     */
    static getSession = cache(async (): Promise<SessionInfo | null> => {
        await connection()

        const cookie = (await cookies()).get(SESSION_COOKIE)?.value
        if (cookie === undefined) return null
        const payload = verifyToken(cookie)

        // Check if session does not exist or has expired
        const currentTimeSeconds = Date.now() / 1000
        if (
            payload?.exp == undefined ||
            payload.exp <= currentTimeSeconds ||
            !isUserJwtPayload(payload)
        ) {
            return null
        }

        const admin = await GammaService.isAdmin(payload.sub as gamma.UserId)

        return {
            ...payload,
            is_admin: admin,
        }
    })

    /**
     * Verify that a valid session is stored in cookies and redirect to the login
     * page if not.
     *
     * Protected server actions should call this function before processing
     * requests.
     *
     * @returns The session if it exists and is valid.
     */
    static verifySession = cache(async (): Promise<SessionInfo> => {
        await connection()

        const session = await this.getSession()

        if (session === null) {
            // The redirect is to the homepage instead of the login page since
            // Gamma will instantly authenticate the user if they have authorized
            // the client. This is an unintuitive user flow, as the user is logged
            // in without an intentional action.
            return redirect('/')
        }
        return session
    })

    /**
     * Delete the current session cookie, leaving the user unauthenticated.
     */
    static async deleteSession(): Promise<void> {
        const cookieStore = await cookies()
        cookieStore.delete(SESSION_COOKIE)
    }
}
