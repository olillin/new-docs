import { Card } from '@heroui/react'
import { FileText } from 'lucide-react'
import Link from 'next/link'

import type { Document } from '@/generated/prisma/browser'

import { joinPath, toIsoDateString } from '../lib/util'

export function DocumentCard({
    document,
    revisedAt,
}: {
    document: Document
    revisedAt?: Date
}) {
    return (
        <Link href={joinPath('/document', document.slug)}>
            <Card>
                <FileText />
                <Card.Header>
                    <Card.Title>{document.svName}</Card.Title>
                    <Card.Description>
                        Last revised at{' '}
                        {revisedAt ? toIsoDateString(revisedAt) : 'unknown'}
                    </Card.Description>
                </Card.Header>
            </Card>
        </Link>
    )
}
