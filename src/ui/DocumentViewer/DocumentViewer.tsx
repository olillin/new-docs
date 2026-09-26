'use client'

import clsx from 'clsx'
import { useState, type ReactNode } from 'react'

import type { DocumentWithUploads } from '@/lib/prisma'

import { DocumentHistory } from './DocumentHistory'

export type DocumentViewerProps = {
    document: DocumentWithUploads
    historyOpen?: boolean
    className?: string
}

export function DocumentViewer({
    document,
    className,
    historyOpen,
}: DocumentViewerProps): ReactNode {
    const [upload, setUpload] = useState(document.uploads[0])

    const iframeUrl = `/api/upload/${upload.hash}`

    return (
        <div
            className={
                'grid grid-cols-[1fr_max-content] grid-rows-1 ' + className
            }
        >
            <main>
                <iframe src={iframeUrl} width="100%" height="100%" />
            </main>
            <aside className="flex h-full min-h-0 flex-col">
                <DocumentHistory
                    uploads={document.uploads}
                    onSelectUpload={setUpload}
                    selectedUploadHash={upload.hash}
                    className={clsx({
                        'w-[20em]': historyOpen,
                        'w-0': !historyOpen,
                    })}
                />
            </aside>
        </div>
    )
}
