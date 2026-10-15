'use client'

import { useEffect, useState } from 'react'

import { SessionInfo } from '@/lib/tokenDefinitions'

export function useSession(): null | SessionInfo {
    const [session, setSession] = useState<null | SessionInfo>(null)

    useEffect(() => {
        fetch(`/api/session`)
            .then(res => {
                if (!res.ok) throw new Error('Unauthorized')
                return res.json()
            })
            .then(json => SessionInfo.parse(json))
            .then(value => setSession(value))
            .catch(reason => {
                if (
                    reason instanceof Error &&
                    reason.message === 'Unauthorized'
                )
                    return
                console.error(reason)
            })
    }, [])

    return session
}
