import { NextRequest, NextResponse } from 'next/server'

import { Upload, Prisma } from '@/app/generated/prisma/client'
import { prisma } from '@/app/lib/prisma'
import { createApiError } from '@/app/lib/responses'
import { saveUpload } from '@/app/lib/upload'
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

export async function POST(req: NextRequest, ctx: { params: Promise<Params> }) {
    // TODO: Add user/API authentication

    const params = await ctx.params

    const document = await prisma.document.findFirst({
        where: {
            category: {
                slug: params.category,
            },
            slug: params.slug,
        },
    })
    if (document == null) {
        return createApiError(404, 'Document does not exist')
    }

    const formData = await req.formData()

    const file = formData.get('file')
    if (file == null) {
        return createApiError(400, "Missing required form argument 'file'")
    }
    if (typeof file !== 'object') {
        return createApiError(
            400,
            "Invalid value for 'file', must be a file upload"
        )
    }

    const revisedAt = formData.get('revised-at')
    let revisedAtDate: null | Date = null
    if (revisedAt) {
        if (
            typeof revisedAt !== 'string' ||
            !/^\d{4}(-\d{2}){2}(T\d{2}(:\d{2}){0,2}(\.\d{3})?Z)?$/.test(
                revisedAt
            )
        ) {
            return createApiError(
                400,
                "Invalid value for 'revised-at', must be an ISO date time"
            )
        }
        revisedAtDate = new Date(revisedAt)
        if (isNaN(revisedAtDate.getTime())) {
            return createApiError(
                400,
                "Invalid date for 'revised-at', must be an ISO date time"
            )
        }
    }

    let hash: string | null = null
    try {
        hash = await saveUpload(file, document.id, revisedAtDate)
    } catch (error: unknown) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                return createApiError(409, 'This file already exists')
            }
        }
        console.error('Failed to save file:', error)
        return createApiError(
            500,
            `Failed to save file, please try again later`
        )
    }

    const headers = new Headers()
    headers.set('Location', createAbsoluteUrl(`/uploads/${hash}`).href)

    return new NextResponse('OK', {
        status: 201,
        statusText: 'Created',
        headers,
    })
}
