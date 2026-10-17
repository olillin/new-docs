'use client'

import { useEffect, useState } from 'react'

import type { DocumentWithUploads } from '@/lib/api/schemas'

import { rpcClient } from '@/lib/rpc'

export function useDocument(slug: string): null | DocumentWithUploads {
    const [document, setDocument] = useState<null | DocumentWithUploads>(null)

    useEffect(() => {
        rpcClient
            .getDocumentBySlug(slug)
            .then(value => setDocument(value))
            .catch(reason => {
                console.error(reason)
            })
    }, [slug])

    return document
}
