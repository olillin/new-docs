import { Card } from '@heroui/react'
import { ScrollText } from 'lucide-react'
import Link from 'next/link'

import type { Category, MeetingMinutes } from '@/generated/prisma/browser'

import { createUploadUrl, toIsoDateString } from '@/lib/util'

export function MeetingMinutesCard({
    category,
    minutes,
}: {
    category: Category
    minutes: MeetingMinutes
}) {
    return (
        <Link href={createUploadUrl(minutes.hash).pathname}>
            <Card>
                <ScrollText />
                <Card.Header>
                    <Card.Title>
                        {category.svName} {toIsoDateString(minutes.meetingDate)}
                    </Card.Title>
                    <Card.Description>
                        {/* TODO: Include (local) time in posted time */}
                        Posted at {toIsoDateString(minutes.createdAt)}
                    </Card.Description>
                </Card.Header>
            </Card>
        </Link>
    )
}
