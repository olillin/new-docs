import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'

import { PrismaClient, type Prisma } from '@/generated/prisma/client'
import { env } from '@/lib/env'

const connectionString = `${env.DATABASE_URL}`

const adapter = new PrismaPg({ connectionString })
export const prisma = new PrismaClient({ adapter })

export type CategoryWithDocumentsAndMeetingMinutes = Prisma.CategoryGetPayload<{
    include: {
        documents: {
            include: {
                uploads: true
            }
        }
        meetingMinutes: true
    }
}>

export type DocumentWithUploads = Prisma.DocumentGetPayload<{
    include: {
        uploads: true
    }
}>
