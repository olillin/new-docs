import { route, routeOperation, TypedNextResponse } from 'next-rest-framework'

import { getDocumentBySlug } from '@/actions/documents'
import { ApiError, createApiErrorOutputs } from '@/lib/api/responses'
import { DocumentSlugParams, DocumentWithUploads } from '@/lib/api/schemas'

export const { GET } = route({
    getDocumentMeta: routeOperation({
        method: 'GET',
    })
        .input({
            params: DocumentSlugParams,
        })
        .outputs([
            {
                status: 200,
                contentType: 'application/json',
                body: DocumentWithUploads,
            },
            ...createApiErrorOutputs([404] as const),
        ])
        .handler(async (_req, { params }) => {
            const document = await getDocumentBySlug(params.slug)

            if (document == null) {
                return ApiError.documentNotExist
            }

            const body = document
            return TypedNextResponse.json(body)
        }),
})
