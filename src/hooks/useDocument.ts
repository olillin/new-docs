'use client'

import { useEffect, useState } from 'react'
import z from 'zod'

import type { DocumentWithUploads } from '@/lib/prisma'

export const uploadSchema = z.object({
    hash: z.string(),
    documentId: z.int(),
    revisedAt: z.coerce.date().or(z.null()),
    createdAt: z.coerce.date(),
})

export const documentWithUploadsSchema = z.object({
    id: z.int(),
    slug: z.string(),
    svName: z.string(),
    enName: z.string(),
    priority: z.int().or(z.null()),
    categoryId: z.int(),
    uploads: z.array(uploadSchema),
})

export function useDocument(slug: string): null | DocumentWithUploads {
    const [document, setDocument] = useState<null | DocumentWithUploads>(null)

    useEffect(() => {
        fetch(`/api/document/${slug}/meta`)
            .then(res => res.json())
            .then(json => documentWithUploadsSchema.parse(json))
            .then(value => setDocument(value))
            .catch(reason => {
                console.error(reason)
            })
    }, [slug])

    return document
}
