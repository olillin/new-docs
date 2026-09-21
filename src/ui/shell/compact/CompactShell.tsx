'use client'

import type { ReactNode } from 'react'

import { CompactHeader, type CompactHeaderProps } from './CompactHeader'

export type CompactShellProps = {
    children?: ReactNode
    className?: string
}

export function CompactShell({
    children,
    className = '',
    ...headerProps
}: CompactHeaderProps & CompactShellProps): ReactNode {
    return (
        <div
            className={
                'grid h-screen max-h-screen min-h-screen grid-rows-[min-content_minmax(0,1fr)] ' +
                className
            }
        >
            <CompactHeader {...headerProps} />
            <div>{children}</div>
        </div>
    )
}
