import { NextRequest, NextResponse } from 'next/server'

import { Upload } from '@/app/generated/prisma/client'
import { prisma } from '@/app/lib/prisma'
import { createApiError } from '@/app/lib/responses'
import { createAbsoluteUrl } from '@/app/lib/util'

type Params = { slug: string }

export async function GET(_req: NextRequest, ctx: { params: Promise<Params> }) {
    const params = await ctx.params

    // Check latest upload of document
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

    const upload: Upload | undefined = document.uploads[0]
    if (upload == undefined) {
        return createApiError(404, 'Document has no uploads')
    }

    return NextResponse.json({
        status: 'OK',
        upload: createAbsoluteUrl(`/uploads/${upload.hash}`).href,
    })
}
