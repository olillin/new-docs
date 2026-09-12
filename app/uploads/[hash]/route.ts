import { NextRequest, NextResponse } from 'next/server'

import { createApiError } from '@/app/lib/responses'
import { FileNotFoundError, readUploadAsStream } from '@/app/lib/upload'

export async function GET(
    _req: NextRequest,
    ctx: { params: Promise<{ hash: string }> }
) {
    const params = await ctx.params

    const { stream, size } = await readUploadAsStream(params.hash).catch(
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
        return createApiError(404, 'Upload does not exist')
    }

    const headers = new Headers()
    headers.set(
        'Content-Disposition',
        `attachment; filename=${params.hash}.pdf`
    )
    headers.set('Content-Type', 'application/pdf')
    headers.set('Content-Length', size.toString())

    const res = new NextResponse(stream, {
        status: 200,
        statusText: 'OK',
        headers,
    })

    return res
}
