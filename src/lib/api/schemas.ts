import z from 'zod'

import { ApiClientJwtPayload, UserJwtPayload } from '../tokenDefinitions'

// Prisma objects
export const DocumentUpload = z.object({
    hash: z.string(),
    documentId: z.int(),
    revisedAt: z.date().or(z.null()),
    createdAt: z.date(),
})
export type DocumentUpload = z.infer<typeof DocumentUpload>

export const DocumentWithUploads = z.object({
    id: z.int(),
    slug: z.string(),
    categoryId: z.int(),
    svName: z.string(),
    enName: z.string(),
    priority: z.int().or(z.null()),
    uploads: z.array(DocumentUpload),
})
export type DocumentWithUploads = z.infer<typeof DocumentWithUploads>

export const MeetingMinute = z.object({
    hash: z.string(),
    meetingDate: z.date(),
    createdAt: z.date(),
    categoryId: z.int(),
})
export type MeetingMinute = z.infer<typeof MeetingMinute>

export const CategoryWithDocumentsAndMeetingMinutes = z.object({
    id: z.int(),
    slug: z.string(),
    superCategoryId: z.int(),
    svName: z.string(),
    enName: z.string(),
    priority: z.int().or(z.null()),
    documents: z.array(DocumentWithUploads),
    meetingMinutes: z.array(MeetingMinute),
})
export type CategoryWithDocumentsAndMeetingMinutes = z.infer<
    typeof CategoryWithDocumentsAndMeetingMinutes
>

// Request schemas
export const DocumentSlugParams = z.object({
    slug: z.string(),
})
export type DocumentSlugParams = z.infer<typeof DocumentSlugParams>

export const UploadHashParams = z.object({
    hash: z.hex().length(64),
})
export type UploadHashParams = z.infer<typeof UploadHashParams>

// Response schemas
export const PdfStream = z.unknown()
export type PdfStream = z.infer<typeof PdfStream>

export const JwtPayloadArgs = {
    iss: z.string().optional(),
    sub: z.string().optional(),
    aud: z.string().or(z.array(z.string())).optional(),
    exp: z.number().optional(),
    nbf: z.number().optional(),
    iat: z.number().optional(),
    jti: z.string().optional(),
}

export const TokenResponse = z.union([
    UserJwtPayload.extend(JwtPayloadArgs),
    ApiClientJwtPayload.extend(JwtPayloadArgs),
])
export type TokenResponse = z.infer<typeof TokenResponse>
