import { route, routeOperation, TypedNextResponse } from 'next-rest-framework'

import {
    ApiError,
    createApiErrorOutputs,
    type ApiErrorType,
    type TypedNextResponseType,
} from '@/lib/api/responses'
import { PdfStream, UploadHashParams } from '@/lib/api/schemas'
import { FileNotFoundError, readUploadAsStream } from '@/lib/upload'

export const { GET } = route({
    getUpload: routeOperation({
        method: 'GET',
    })
        .input({
            params: UploadHashParams,
        })
        .outputs([
            { status: 200, contentType: 'application/pdf', body: PdfStream },
            ...createApiErrorOutputs([404] as const),
        ])
        .handler(async (_req, { params }) => {
            return await createUploadStreamResponse(params.hash)
        }),
})

export async function createUploadStreamResponse(
    hash: string
): Promise<
    ApiErrorType<404> | TypedNextResponseType<PdfStream, 200, 'application/pdf'>
> {
    const { stream, size } = await readUploadAsStream(hash).catch(
        (reason: unknown) => {
            if (!(reason instanceof FileNotFoundError)) {
                console.error(
                    'Something went wrong while reading upload:',
                    String(reason)
                )
            }
            return { stream: null, size: null }
        }
    )

    if (!stream) {
        return ApiError.uploadNotExist
    }

    return new TypedNextResponse(stream, {
        status: 200,
        headers: {
            'Content-Type': 'application/pdf',
            'Content-Length': size.toString(),
        },
    })
}
