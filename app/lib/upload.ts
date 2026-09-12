import { createHash } from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'

import { Prisma } from '@/app/generated/prisma/client'

import { prisma } from './prisma'

export const uploadsDirectoryName = 'uploads'

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
        .open(path.resolve(process.cwd(), uploadsDirectoryName, hash), 'r')
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

/**
 * Save a file to the uploads directory.
 * @param file The file to save.
 * @param documentId The document which this upload is a revision for.
 * @param revisedAt The date when this revision was made.
 * @returns The file hash/name.
 */
export async function saveUpload(
    file: File,
    documentId: number,
    revisedAt?: Date | null
): Promise<string> {
    const bytes = await file.bytes()
    const hash = createHash('sha256').update(bytes).digest('hex')

    await prisma.$transaction(async tx => {
        await tx.upload.create({
            data: {
                hash,
                documentId,
                revisedAt: revisedAt ?? Prisma.skip,
            },
        })

        await fs.writeFile(
            path.resolve(process.cwd(), uploadsDirectoryName, hash),
            bytes
        )
    })

    console.log(`Saved upload ${hash}`)
    return hash
}
