import 'server-only'
import gamma from 'gammait'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { connection } from 'next/server'
import { cache } from 'react'

import { env } from '@/lib/env'

import { isAdmin } from './gamma'
import { verifyToken } from './token'
import {
    isUserJwtPayload,
    SESSION_COOKIE,
    SessionInfo,
    STATE_COOKIE,
    type JwtWithToken,
} from './tokenDefinitions'

/**
 * Create a new session for an authenticated user and store in a cookie.
 * @param jwt The signed JWT.
 * @throws If the token does not have an expiration time.
 */
export async function createSession(jwt: JwtWithToken): Promise<void> {
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
 * Delete the current session cookie, leaving the user unauthenticated.
 */
export async function deleteSession(): Promise<void> {
    const cookieStore = await cookies()
    cookieStore.delete(SESSION_COOKIE)
}

/**
 * Verify that a valid session is stored in cookies and redirect to the login
 * page if not.
 *
 * Protected server actions should call this function before processing
 * requests.
 *
 * @returns The session if it exists and is valid.
 */
export const verifySession = cache(async (): Promise<SessionInfo> => {
    await connection()

    const session = await getSession()

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
 * Get the session stored in cookies, or return null if missing or invalid.
 * @returns The session if it exists and is valid, else null.
 */
export const getSession = cache(async (): Promise<SessionInfo | null> => {
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

    const admin = await isAdmin(payload.sub as gamma.UserId)

    return {
        ...payload,
        is_admin: admin,
    }
})

/** Time before a state expires in milliseconds. */
const stateExpireAfter = 10 * 60 * 1000 // 10 minutes in milliseconds

export async function generateAndStoreRandomState(): Promise<string> {
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

export async function readState(): Promise<string | null> {
    const cookieStore = await cookies()
    const cookie = cookieStore.get(STATE_COOKIE)
    return cookie?.value ?? null
}

export async function deleteState(): Promise<void> {
    const cookieStore = await cookies()
    cookieStore.delete(STATE_COOKIE)
}
