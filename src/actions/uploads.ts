'use server'

import { createHash } from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'

import { Prisma } from '@/generated/prisma/client'
import { prisma } from '@/lib/prisma'
import { uploadsDirectoryName } from '@/lib/upload'

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

    console.log(`New upload: ${hash}`)
    return hash
}

/**
 * Save meeting minutes to the uploads directory.
 * @param file The file to save.
 * @param categoryId The category to save the minutes to.
 * @param meetingDate The date when the meeting took place.
 * @returns The file hash/name.
 */
export async function saveMeetingMinutes(
    file: File,
    categoryId: number,
    meetingDate: Date
): Promise<string> {
    const bytes = await file.bytes()
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
            path.resolve(process.cwd(), uploadsDirectoryName, hash),
            bytes
        )
    })

    console.log(`New meeting minutes: ${hash}`)
    return hash
}
