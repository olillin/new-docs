import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'

import { PrismaClient } from '@/app/generated/prisma/client'

const connectionString = process.env.DATABASE_URL!
const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

await prisma.meetingMinutes.deleteMany({})
await prisma.upload.deleteMany({})
await prisma.document.deleteMany({})
await prisma.category.deleteMany({})

await prisma.category.createMany({
    data: [
        {
            id: 1,
            svName: 'Verksamhetsdokument',
            enName: 'Operational Documents',
            slug: 'operational-documents',
            priority: 1,
        },
        {
            id: 2,
            svName: 'Policier',
            enName: 'Policies',
            slug: 'policies',
            priority: 3,
        },
        {
            id: 3,
            svName: 'Sektionsmötesprotokoll',
            enName: 'Division meeting minutes',
            slug: 'division-meeting-minutes',
            priority: 2,
        },
    ],
})

await prisma.document.createMany({
    data: [
        {
            id: 1,
            categoryId: 1,
            slug: 'bylaws',
            svName: 'Stadga',
            enName: 'Bylaws',
            priority: 1,
        },
        {
            id: 2,
            categoryId: 1,
            slug: 'regulations',
            svName: 'Reglemente',
            enName: 'Regulations',
            priority: 2,
        },
        {
            id: 3,
            categoryId: 2,
            slug: 'financial-policy',
            svName: 'Ekonomisk policy',
            enName: 'Financial Policy',
            priority: 1,
        },
        {
            id: 4,
            categoryId: 2,
            slug: 'environmental-policy',
            svName: 'Miljöpolicy',
            enName: 'Environmental Policy',
            priority: 3,
        },
        {
            id: 5,
            categoryId: 2,
            slug: 'communication-policy',
            svName: 'Kommunikationspolicy',
            enName: 'Communication Policy',
            priority: 2,
        },
    ],
})

// Hashes refer to the documents in the `uploads/` directory
await prisma.upload.createMany({
    data: [
        // Bylaws
        {
            documentId: 1,
            hash: '6f9d0db50653f31c6c27fb5932acc206ada83064f61598ff21bb93511b459747',
            revisedAt: new Date('2026-05-19'),
        },
        // Regulations
        {
            documentId: 2,
            hash: '0b003a4945fb2cabb8070c6bfa65fae1f0602c1c9149cac54a9a909105cd7854',
            revisedAt: new Date('2026-05-19'),
        },
        // Financial Policy
        {
            documentId: 3,
            hash: '87d90fbc5e538388c286b92d0722d678abb53d10da870e430b5d77573be6d84b',
            revisedAt: new Date('2025-12-11'),
        },
        // Climate Policy
        {
            documentId: 4,
            hash: '08a5fe2391a80ac254e56c6c8490abf33a466d8d36d2e48bcdbbddd394f0d8f5',
            revisedAt: new Date('2013-05-16'),
        },
        // Communication Policy
        {
            documentId: 5,
            hash: '3035804f5a0728760e40390e58861c96d6ca79a955a66df160faed4dbd266d67',
            revisedAt: new Date('2020-05-14'),
        },
    ],
})

await prisma.meetingMinutes.createMany({
    data: [
        // Student Division Meetings
        {
            hash: '9818dfaf8303d968b60f5d55648032e1743382ea342b7970c544d1533f3fb58f',
            categoryId: 3,
            meetingDate: new Date('2026-12-11'),
            createdAt: new Date('2026-12-20'),
        },
        {
            hash: '78d83dd592ba2a0f9b8cf91198629d9fa724089b28a9514968ea39f095e92277',
            categoryId: 3,
            meetingDate: new Date('2026-02-26'),
            createdAt: new Date('2026-03-02'),
        },
        {
            hash: '064471409a8da5aa1745d93c71d92bbe174b03af7eca407cf468fe397da28dd8',
            categoryId: 3,
            meetingDate: new Date('2026-05-19'),
            createdAt: new Date('2026-06-19'),
        },
    ],
})

await prisma.$disconnect()
