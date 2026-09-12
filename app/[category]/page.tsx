import { ErrorMessage } from '@heroui/react'

import { prisma } from '../lib/prisma'
import { DocumentCard } from '../ui/DocumentCard'
import { MeetingMinutesCard } from '../ui/MeetingMinutesCard'

export const instant = false

export default async function Page(context: {
    params: Promise<{ category: string }>
}) {
    const params = await context.params
    const category = await prisma.category.findFirst({
        where: {
            slug: params.category,
        },
        include: {
            documents: {
                include: {
                    uploads: {
                        orderBy: {
                            revisedAt: 'desc',
                        },
                        take: 1,
                    },
                },
            },
            meetingMinutes: true,
        },
    })

    if (!category) {
        return <ErrorMessage>Category not found</ErrorMessage>
    }

    return (
        <section>
            <h2 className="mb-4 text-2xl font-semibold tracking-tight">
                {category.svName}
            </h2>
            <div className="flex flex-col flex-nowrap gap-4">
                {category.documents.map(document => {
                    const revisedAt =
                        document.uploads[0]?.revisedAt ?? undefined
                    return (
                        <DocumentCard
                            key={document.id}
                            category={category}
                            document={document}
                            revisedAt={revisedAt}
                        />
                    )
                })}
                {category.meetingMinutes.map(minutes => (
                    <MeetingMinutesCard
                        key={minutes.hash}
                        category={category}
                        minutes={minutes}
                    />
                ))}
            </div>
        </section>
    )
}
