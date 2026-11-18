'use server'

import { rpcOperation } from 'next-rest-framework'
import z from 'zod'

import { DocumentWithUploadsJSON } from '@/lib/api/schemas'
import { prisma } from '@/lib/prisma'

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
        const document = await prisma.document.findFirst({
            where: {
                slug,
            },
            include: {
                uploads: {
                    orderBy: [
                        {
                            revisedAt: 'desc',
                        },
                        { createdAt: 'desc' },
                    ],
                },
            },
        })

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
