import 'server-only'
import jwt from 'jsonwebtoken'

import { env } from '@/lib/env'

import {
    ApiClientJwtPayload,
    defaultJwtExpirationSeconds,
    type JwtWithToken,
    type UserJwtPayload,
} from './tokenDefinitions'

const jwtIssuer = env.JWT_ISSUER ?? 'cthit-docs'

export function signUserJwtPayload(
    payload: UserJwtPayload
): Promise<JwtWithToken> {
    return new Promise((resolve, reject) => {
        const expireSeconds: number =
            env.JWT_EXPIRES_IN !== undefined
                ? parseInt(env.JWT_EXPIRES_IN)
                : defaultJwtExpirationSeconds

        try {
            jwt.sign(
                {
                    sub: payload.sub,
                    nickname: payload.nickname,
                    picture: payload.picture,
                } satisfies UserJwtPayload,
                env.JWT_SECRET,
                {
                    issuer: jwtIssuer,
                    algorithm: 'HS256',
                    expiresIn: expireSeconds,
                    notBefore: 0,
                    jwtid: crypto.randomUUID(),
                } satisfies jwt.SignOptions,
                (error, token) => {
                    if (error) reject(error)
                    else if (token) {
                        const token_content = jwt.decode(token, {
                            json: true,
                        })!
                        resolve({
                            access_token: token,
                            token_type: 'Bearer',
                            ...token_content,
                        })
                    }
                }
            )
        } catch (error: unknown) {
            if (error instanceof Error) {
                reject(error)
            } else {
                reject(new Error(String(error)))
            }
        }
    })
}

export function signApiClientJwtPayload(
    payload: ApiClientJwtPayload
): Promise<JwtWithToken> {
    return new Promise((resolve, reject) => {
        const expireSeconds: number =
            env.JWT_EXPIRES_IN !== undefined
                ? parseInt(env.JWT_EXPIRES_IN)
                : defaultJwtExpirationSeconds

        try {
            jwt.sign(
                {
                    sub: payload.sub,
                    scope: payload.scope,
                } satisfies ApiClientJwtPayload,
                env.JWT_SECRET,
                {
                    issuer: jwtIssuer,
                    audience: payload.sub,
                    algorithm: 'HS256',
                    expiresIn: expireSeconds,
                    notBefore: 0,
                    jwtid: crypto.randomUUID(),
                } satisfies jwt.SignOptions,
                (error, token) => {
                    if (error) reject(error)
                    else if (token) {
                        const token_content = jwt.decode(token, {
                            json: true,
                        })!
                        resolve({
                            access_token: token,
                            token_type: 'Bearer',
                            ...token_content,
                        })
                    }
                }
            )
        } catch (error: unknown) {
            if (error instanceof Error) {
                reject(error)
            } else {
                reject(new Error(String(error)))
            }
        }
    })
}

export function verifyToken(token: string): jwt.JwtPayload {
    const verifiedToken = jwt.verify(token, env.JWT_SECRET, {
        algorithms: ['HS256'],
        issuer: jwtIssuer,
    })
    if (typeof verifiedToken === 'string') {
        throw new Error('Failed to verify token, got string payload')
    }
    return verifiedToken
}
