'use server'

import { rpcOperation } from 'next-rest-framework'
import z from 'zod'

import { DocumentWithUploads } from '@/lib/api/schemas'
import { prisma } from '@/lib/prisma'

export const getDocumentBySlug = rpcOperation()
    .input({
        contentType: 'application/json',
        body: z.string(),
    })
    .outputs([
        {
            contentType: 'application/json',
            body: DocumentWithUploads.or(z.null()),
        },
    ])
    .handler(async (slug: string): Promise<DocumentWithUploads | null> => {
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

        return document
    })
