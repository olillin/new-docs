import { Card } from '@heroui/react'
import { FileText } from 'lucide-react'
import Link from 'next/link'

import { Document } from '@/app/generated/prisma/browser'

import { Category } from '../generated/prisma/client'
import { joinPath, toIsoDateString } from '../lib/util'

export function DocumentCard({
    baseUrl,
    category,
    document,
    revisedAt,
}: {
    baseUrl?: string
    category: Category
    document: Document
    revisedAt?: Date
}) {
    return (
        <Link href={joinPath(baseUrl ?? '/' + category.slug, document.slug)}>
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
