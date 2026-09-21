import { Card } from '@heroui/react'
import { ScrollText } from 'lucide-react'
import Link from 'next/link'

import { Category, MeetingMinutes } from '@/app/generated/prisma/browser'

import { joinPath, toIsoDateString } from '../lib/util'

export function MeetingMinutesCard({
    category,
    minutes,
}: {
    category: Category
    minutes: MeetingMinutes
}) {
    return (
        <Link href={joinPath('/uploads', minutes.hash)}>
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
