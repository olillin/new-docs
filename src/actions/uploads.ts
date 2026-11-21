'use server'

import { UploadService } from '@/services/uploadService'

/**
 * Save a file to the uploads directory and database.
 * @param file The file to save.
 * @param documentId The document which this upload is a revision for.
 * @param revisedAt The date when this revision was made.
 * @returns The file hash which is also the saved filename.
 */
export async function saveUpload(
    file: File,
    documentId: number,
    revisedAt?: Date | null
): Promise<string> {
    const bytes = await file.bytes()
    const hash = await UploadService.createUpload(bytes, documentId, revisedAt)

    console.log(`New upload: ${hash}`)
    return hash
}

/**
 * Save meeting minutes to the uploads directory and database.
 * @param file The file to save.
 * @param categoryId The category the minutes belong to.
 * @param meetingDate The date when the meeting took place.
 * @returns The file hash which is also the saved filename.
 */
export async function saveMeetingMinutes(
    file: File,
    categoryId: number,
    meetingDate: Date
): Promise<string> {
    const bytes = await file.bytes()
    const hash = await UploadService.createMeetingMinutes(
        bytes,
        categoryId,
        meetingDate
    )

    console.log(`New meeting minutes: ${hash}`)
    return hash
}
