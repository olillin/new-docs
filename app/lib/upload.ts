import fs from 'node:fs/promises'
import path from 'node:path'

export class FileNotFoundError extends Error {
    constructor(message?: string) {
        super(message ?? 'File not found')
    }
}

export async function readUploadAsStream(
    hash: string
): Promise<{ stream: ReadableStream; size: number }> {
    if (!/^[0-9a-f]+$/.test(hash)) {
        throw new Error('Invalid hash')
    }

    // Taken from https://github.com/vercel/next.js/discussions/86555#discussioncomment-15091429
    const f = await fs
        .open(path.resolve(process.cwd(), 'uploads', hash), 'r')
        .catch(() => {
            throw new FileNotFoundError()
        })

    const buffer = f.readableWebStream()
    const reader = buffer.getReader()
    const stream = new ReadableStream({
        async pull(controller): Promise<void> {
            /* oxlint-disable typescript/no-unsafe-assignment */
            const { value, done } = await reader.read()

            if (done) {
                controller.close()
                await f.close()
            } else {
                controller.enqueue(value)
            }
        },
    })
    const { size } = await f.stat()

    return { stream, size }
}
