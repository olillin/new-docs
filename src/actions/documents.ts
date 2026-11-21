'use server'

import { rpcOperation } from 'next-rest-framework'
import z from 'zod'

import { DocumentWithUploadsJSON } from '@/lib/api/schemas'
import DocumentService from '@/services/documentService'

export const getDocumentBySlug = rpcOperation()
    .input({
        contentType: 'application/json',
        body: z.string(),
    })
    .outputs([
        {
            contentType: 'application/json',
            body: DocumentWithUploadsJSON.or(z.null()),
        },
    ])
    .handler(async (slug: string): Promise<DocumentWithUploadsJSON | null> => {
        const document = await DocumentService.getDocumentBySlug(slug)
        if (document == null) {
            return null
        }

        return {
            ...document,
            uploads: document.uploads.map(upload => ({
                ...upload,
                revisedAt: upload.revisedAt?.toISOString() ?? null,
                createdAt: upload.createdAt.toISOString(),
            })),
        }
    })
