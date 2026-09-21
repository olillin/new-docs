import { ErrorMessage } from '@heroui/react'

import { prisma } from '@/app/lib/prisma'
import { CategoryArticle } from '@/app/ui/CategoryArticle'

export const instant = false

export default async function Page(context: {
    params: Promise<{ superCategory: string }>
}) {
    const params = await context.params
    const superCategory = await prisma.superCategory.findFirst({
        where: {
            slug: params.superCategory,
        },
        include: {
            categories: {
                include: {
                    documents: {
                        orderBy: {
                            priority: 'asc',
                        },
                        include: {
                            uploads: {
                                orderBy: {
                                    revisedAt: 'desc',
                                },
                                take: 1,
                            },
                        },
                    },
                    meetingMinutes: {
                        orderBy: {
                            meetingDate: 'desc',
                        },
                    },
                },
            },
        },
    })

    if (!superCategory) {
        return <ErrorMessage>Category not found</ErrorMessage>
    }

    return (
        <section>
            <h2 className="mb-4 text-2xl font-semibold tracking-tight">
                {superCategory.svName}
            </h2>

            {superCategory.categories.map(category => (
                <CategoryArticle
                    key={category.id}
                    category={category}
                    hideHeading={superCategory.categories.length === 1}
                />
            ))}
        </section>
    )
}
