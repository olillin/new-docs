'use client'

import type { ReactNode } from 'react'

import { Button, ScrollShadow } from '@heroui/react'

import type { Upload } from '@/generated/prisma/client'

import { toIsoDateString } from '@/lib/util'

export type DocumentHistoryProps = {
    uploads: Upload[]
    onSelectUpload?: (value: Upload) => void
    selectedUploadHash?: string
    className?: string
}

export function DocumentHistory({
    uploads,
    onSelectUpload,
    selectedUploadHash,
    className = '',
}: DocumentHistoryProps): ReactNode {
    return (
        <div
            className={
                'relative h-full max-h-full max-w-[50vw] flex-1 overflow-hidden transition transition-[width] motion-reduce:transition-none ' +
                className
            }
        >
            <ScrollShadow className="h-full max-h-full overflow-y-auto">
                <ul className="flex flex-col flex-nowrap items-center gap-4 px-4 py-6">
                    {uploads.map(upload => (
                        <Button
                            key={upload.hash}
                            variant={
                                upload.hash === selectedUploadHash
                                    ? 'primary'
                                    : 'secondary'
                            }
                            onClick={() => {
                                onSelectUpload?.(upload)
                            }}
                        >
                            Revision at{' '}
                            {upload.revisedAt
                                ? toIsoDateString(upload.revisedAt)
                                : 'unknown'}
                        </Button>
                    ))}
                </ul>
            </ScrollShadow>
        </div>
    )
}
