'use client'

import { ErrorMessage } from '@heroui/react'
import clsx from 'clsx'
import { HistoryIcon } from 'lucide-react'
import { useState, type ReactNode } from 'react'

import { DocumentViewer } from '@/components/DocumentViewer/DocumentViewer'
import { CompactShell } from '@/components/shell/compact/CompactShell'
import { useDocument } from '@/hooks/useDocument'

export function ClientPageContent({ slug }: { slug: string }): ReactNode {
    const document = useDocument(slug)
    const [historyOpen, setHistoryOpen] = useState(true)

    if (!document) {
        return <ErrorMessage>Unknown document</ErrorMessage>
    }

    return (
        <CompactShell
            endItems={[
                {
                    children: (
                        <div
                            className={clsx('rounded-full', {
                                'bg-turkos/50': historyOpen,
                            })}
                        >
                            <HistoryIcon />
                        </div>
                    ),
                    tooltip: 'View document history',
                    onClick: () => {
                        setHistoryOpen(!historyOpen)
                    },
                },
            ]}
        >
            <DocumentViewer
                document={document}
                className="h-full"
                historyOpen={historyOpen}
            />
        </CompactShell>
    )
}
