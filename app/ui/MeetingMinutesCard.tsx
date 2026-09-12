import { Card } from '@heroui/react'
import { ScrollText } from 'lucide-react'
import Link from 'next/link'

import { Category, MeetingMinutes } from '@/app/generated/prisma/browser'

import { joinPath, toISODateString } from '../lib/util'

export function MeetingMinutesCard({
    baseUrl,
    category,
    minutes,
}: {
    baseUrl?: string
    category: Category
    minutes: MeetingMinutes
}) {
    return (
        <Link href={joinPath(baseUrl ?? '/' + category.slug, minutes.hash)}>
            <Card>
                <ScrollText />
                <Card.Header>
                    <Card.Title>
                        {category.svName} {toISODateString(minutes.meetingDate)}
                    </Card.Title>
                    <Card.Description>
                        {/* TODO: Include (local) time in posted time */}
                        Posted at {toISODateString(minutes.createdAt)}
                    </Card.Description>
                </Card.Header>
            </Card>
        </Link>
    )
}
