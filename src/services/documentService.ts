import type { DocumentWithUploads } from '@/lib/api/schemas'

import { prisma } from '@/lib/prisma'

export default class DocumentService {
    static async getDocumentBySlug(
        slug: string
    ): Promise<DocumentWithUploads | null> {
        return await prisma.document.findFirst({
            where: {
                slug,
            },
            include: {
                uploads: {
                    orderBy: [
                        {
                            revisedAt: 'desc',
                        },
                        { createdAt: 'desc' },
                    ],
                },
            },
        })
    }
}
