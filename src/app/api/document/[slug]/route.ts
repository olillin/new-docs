import { route, routeOperation, TypedNextResponse } from 'next-rest-framework'
import z from 'zod'
import * as zfd from 'zod-form-data'

import { getDocumentBySlug } from '@/actions/documents'
import { saveUpload } from '@/actions/uploads'
import { type Upload, Prisma } from '@/generated/prisma/client'
import {
    validateTokenMiddleware,
    enforceAdminMiddleware,
} from '@/lib/api/middleware'
import { ApiError, createApiErrorOutputs } from '@/lib/api/responses'
import { DocumentSlugParams, PdfStream } from '@/lib/api/schemas'
import { prisma } from '@/lib/prisma'
import { createUploadUrl } from '@/lib/url'

import { createUploadStreamResponse } from '../../upload/[hash]/route'

export const { GET, POST } = route({
    getDocument: routeOperation({
        method: 'GET',
    })
        .input({
            params: DocumentSlugParams,
        })
        .outputs([
            { status: 200, contentType: 'application/pdf', body: PdfStream },
            ...createApiErrorOutputs([404] as const),
        ])
        .handler(async (_req, { params }) => {
            const document = await getDocumentBySlug(params.slug)

            if (document == null) {
                return ApiError.documentNotExist
            }

            // Serve latest upload of document
            const upload: Upload | undefined = document.uploads[0]
            if (upload == undefined) {
                return ApiError.documentNoUploads
            }

            return await createUploadStreamResponse(upload.hash)
        }),
    addDocumentRevision: routeOperation({
        method: 'POST',
    })
        .input({
            contentType: 'multipart/form-data',
            params: DocumentSlugParams,
            body: zfd.formData({
                file: zfd.file(),
                'revised-at': z.iso.date({
                    message: 'Must be an ISO date time',
                }),
            }),
        })
        .outputs([
            { status: 201, contentType: 'text/plain', body: z.literal('OK') },
            ...createApiErrorOutputs([400, 401, 403, 404, 409, 500] as const),
        ])
        .middleware(validateTokenMiddleware)
        .middleware(enforceAdminMiddleware)
        .handler(async (req, { params }) => {
            const document = await prisma.document.findFirst({
                where: {
                    slug: params.slug,
                },
            })
            if (document == null) {
                return ApiError.documentNotExist
            }

            const formData = await req.formData()

            const file = formData.get('file')
            if (typeof file !== 'object') {
                return ApiError.fileUploadOption
            }

            const revisedAt = formData.get('revised-at')
            const revisedAtDate = new Date(revisedAt)

            let hash: string | null = null
            try {
                hash = await saveUpload(file, document.id, revisedAtDate)
            } catch (error: unknown) {
                if (error instanceof Prisma.PrismaClientKnownRequestError) {
                    if (error.code === 'P2002') {
                        return ApiError.uploadAlreadyExists
                    }
                }
                console.error('Failed to save file:', error)
                return ApiError.fileSaveFailed
            }

            return new TypedNextResponse('OK', {
                status: 201,
                statusText: 'Created',
                headers: {
                    'Content-Type': 'text/plain',
                    Location: createUploadUrl(hash).href,
                },
            })
        }),
})
