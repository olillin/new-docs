'use client'

import { getCookie } from 'cookies-next/client'
import { useEffect, useState } from 'react'

import { rpcClient } from '@/lib/rpc'
import { SESSION_COOKIE, SessionInfo } from '@/lib/tokenDefinitions'

export function useSession(): null | SessionInfo {
    const [session, setSession] = useState<null | SessionInfo>(null)

    useEffect(() => {
        Promise.resolve(getCookie(SESSION_COOKIE))
            .then(cookie => {
                if (cookie === undefined) {
                    throw new Error('Missing session cookie')
                } else {
                    return rpcClient.getSession(cookie)
                }
            })
            .then(value => {
                if (value === null) {
                    throw new Error('Session invalid')
                } else {
                    setSession(value)
                }
            })
            .catch(reason => {
                if (
                    reason instanceof Error &&
                    reason.message === 'Unauthorized'
                )
                    return
                console.warn(reason)
            })
    }, [])

    return session
}
