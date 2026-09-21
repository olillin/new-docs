import { type CategoryWithDocumentsAndMeetingMinutes } from '@/lib/prisma'

import { DocumentCard } from './DocumentCard'
import { MeetingMinutesCard } from './MeetingMinutesCard'

export function CategoryArticle({
    category,
    hideHeading = false,
}: {
    category: CategoryWithDocumentsAndMeetingMinutes
    hideHeading?: boolean
}) {
    return (
        <article className="my-4">
            {!hideHeading && (
                <h3 className="text-md mb-2 font-semibold tracking-tight">
                    {category.svName}
                </h3>
            )}
            <div className="flex flex-col flex-nowrap gap-4">
                {category.documents.map(document => {
                    const revisedAt =
                        document.uploads[0]?.revisedAt ?? undefined
                    return (
                        <DocumentCard
                            key={document.id}
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
        </article>
    )
}
