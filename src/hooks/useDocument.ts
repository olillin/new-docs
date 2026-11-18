'use client'

import { useEffect, useState } from 'react'

import type { DocumentUpload, DocumentWithUploads } from '@/lib/api/schemas'

import { rpcClient } from '@/lib/rpc'

export function useDocument(slug: string): null | DocumentWithUploads {
    const [document, setDocument] = useState<null | DocumentWithUploads>(null)

    useEffect(() => {
        rpcClient
            .getDocumentBySlug(slug)
            .then(value => {
                if (value == null) {
                    setDocument(null)
                    return
                }

                const document: DocumentWithUploads = {
                    ...value,
                    uploads: value.uploads.map<DocumentUpload>(upload => ({
                        ...upload,
                        revisedAt:
                            upload.revisedAt == null
                                ? null
                                : new Date(upload.revisedAt),
                        createdAt: new Date(upload.createdAt),
                    })),
                }

                setDocument(document)
            })
            .catch(reason => {
                console.error(reason)
            })
    }, [slug])

    return document
}
