'use client'

import { ErrorMessage } from '@heroui/react'
import clsx from 'clsx'
import { HistoryIcon } from 'lucide-react'
import { useState, type ReactNode } from 'react'

import { useDocument } from '@/hooks/useDocument'
import { DocumentViewer } from '@/ui/DocumentViewer/DocumentViewer'
import { CompactShell } from '@/ui/shell/compact/CompactShell'

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
