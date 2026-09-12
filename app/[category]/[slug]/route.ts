import { NextRequest, NextResponse } from 'next/server'

import { Upload } from '@/app/generated/prisma/client'
import { prisma } from '@/app/lib/prisma'
import { createApiError } from '@/app/lib/responses'
import { createAbsoluteUrl } from '@/app/lib/util'

type Params = { category: string; slug: string }

export async function GET(_req: NextRequest, ctx: { params: Promise<Params> }) {
    const params = await ctx.params

    // Serve latest upload of document
    const document = await prisma.document.findFirst({
        where: {
            category: {
                slug: params.category,
            },
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

    if (document != null) {
        const upload: Upload | undefined = document.uploads[0]
        if (upload == undefined) {
            return createApiError(404, 'Document has no uploads')
        }
        return NextResponse.redirect(
            createAbsoluteUrl(`/uploads/${upload.hash}`)
        )
    }

    // Serve meeting minutes
    const minutes = await prisma.meetingMinutes.findFirst({
        where: {
            category: {
                slug: params.category,
            },
            hash: params.slug,
        },
    })

    if (minutes != null) {
        return NextResponse.redirect(
            createAbsoluteUrl(`/uploads/${minutes.hash}`)
        )
    }

    return createApiError(
        404,
        `Unknown document "${params.slug}" in category "${params.category}"`
    )
}
