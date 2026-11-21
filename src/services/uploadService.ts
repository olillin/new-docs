import { createHash, type BinaryLike } from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'

import { env } from '@/environment'
import { Prisma } from '@/generated/prisma/client'
import { prisma } from '@/lib/prisma'

export class FileNotFoundError extends Error {
    constructor(message?: string) {
        super(message ?? 'File not found')
    }
}

export class UploadService {
    static async readUploadAsStream(
        hash: string
    ): Promise<{ stream: ReadableStream; size: number }> {
        if (!/^[0-9a-f]+$/.test(hash)) {
            throw new Error('Invalid hash')
        }

        // Taken from https://github.com/vercel/next.js/discussions/86555#discussioncomment-15091429
        const f = await fs
            .open(path.resolve(process.cwd(), env.UPLOADS_DIRECTORY, hash), 'r')
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
     * Save a file to the uploads directory and database.
     * @param bytes The bytes of the file.
     * @param documentId The document which this upload is a revision for.
     * @param revisedAt The date when this revision was made.
     * @returns The file hash which is also the saved filename.
     */
    static async createUpload(
        bytes: BinaryLike,
        documentId: number,
        revisedAt?: Date | null
    ): Promise<string> {
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
                path.resolve(process.cwd(), env.UPLOADS_DIRECTORY, hash),
                bytes
            )
        })

        return hash
    }

    /**
     * Save meeting minutes to the uploads directory and database.
     * @param bytes The bytes of the file.
     * @param categoryId The category the minutes belong to.
     * @param meetingDate The date when the meeting took place.
     * @returns The file hash which is also the saved filename.
     */
    static async createMeetingMinutes(
        bytes: BinaryLike,
        categoryId: number,
        meetingDate: Date
    ): Promise<string> {
        const hash = createHash('sha256').update(bytes).digest('hex')

        await prisma.$transaction(async tx => {
            await tx.meetingMinutes.create({
                data: {
                    hash,
                    categoryId,
                    meetingDate,
                },
            })

            await fs.writeFile(
                path.resolve(process.cwd(), env.UPLOADS_DIRECTORY, hash),
                bytes
            )
        })

        return hash
    }
}
