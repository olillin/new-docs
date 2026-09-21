import { NextRequest, NextResponse } from 'next/server'

import { prisma, type DocumentWithUploads } from '@/lib/prisma'
import { createApiError } from '@/lib/responses'

type Params = { slug: string }

export async function GET(_req: NextRequest, ctx: { params: Promise<Params> }) {
    const params = await ctx.params

    const document = await prisma.document.findFirst({
        where: {
            slug: params.slug,
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
        return createApiError(404, `Unknown document "${params.slug}"`)
    }

    const body: DocumentWithUploads = document
    return NextResponse.json(body)
}
