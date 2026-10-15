import jwt from 'jsonwebtoken'
import z from 'zod'

/** Time before a JWT expires in seconds. */
export const defaultJwtExpirationSeconds = 4 * 60 * 60 // 4 hours in seconds

export const acceptedGrantTypes = [
    'authorization_code',
    'client_credentials',
] as const
export type GrantType = (typeof acceptedGrantTypes)[number]

export interface JwtWithToken extends jwt.JwtPayload {
    access_token: string
    token_type: 'Bearer'
}

export const UserJwtPayload = z.object({
    /** JWT subject/user id. */
    sub: z.uuidv4(),
    /** Nickname of the user. */
    nickname: z.string(),
    /** URL to the user's profile picture. */
    picture: z.url().optional(),
})
export type UserJwtPayload = z.infer<typeof UserJwtPayload>

export const ApiClientJwtPayload = z.object({
    /** JWT subject/client id. */
    sub: z.uuidv4(),
    /** API scopes for client. */
    scope: z.string(),
})
export type ApiClientJwtPayload = z.infer<typeof ApiClientJwtPayload>

export function isUserJwtPayload(value: unknown): value is UserJwtPayload {
    return UserJwtPayload.safeParse(value).success
}

export function isApiClientJwtPayload(
    value: unknown
): value is ApiClientJwtPayload {
    return ApiClientJwtPayload.safeParse(value).success
}
/** Properties stored in the session token. */
export const SessionInfo = UserJwtPayload.extend({
    /** If the user is an administrator. */
    is_admin: z.boolean(),
})
export type SessionInfo = z.infer<typeof SessionInfo> & jwt.JwtPayload

export const SESSION_COOKIE = 'session'
export const STATE_COOKIE = 'state'
