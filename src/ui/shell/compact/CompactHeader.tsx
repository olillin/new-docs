import type { ReactNode } from 'react'

import { Tooltip } from '@heroui/react'
import Image from 'next/image'
import Link from 'next/link'

import itLogo from '@/assets/it-logo.png'

export type CompactHeaderItem = {
    children: ReactNode
    tooltip?: ReactNode
    onClick?: () => void
}

export type CompactHeaderProps = {
    startItems?: CompactHeaderItem[]
    endItems?: CompactHeaderItem[]
}

export function CompactHeader({
    startItems,
    endItems,
}: CompactHeaderProps): ReactNode {
    return (
        <header className="h-10 bg-[#0a0a0a] px-4 py-2 gap-6 grid grid-cols-[max-content_1fr] grid-rows-1 relative">
            <Link
                href="/"
                className="flex h-full flex-row flex-nowrap items-center gap-2"
            >
                <span className="relative aspect-square h-full overflow-hidden">
                    <Image
                        src={itLogo}
                        alt="Software Engineering Student Division Logo"
                        fill
                        sizes="24px"
                    />
                </span>
                <span className="text-lg font-bold tracking-tight">Docs</span>
            </Link>

            <span className="flex flex-row flex-nowrap justify-between h-full gap-4">
                {startItems ? (
                    <HeaderItemList items={startItems} />
                ) : (
                    <span></span>
                )}
                {endItems ? <HeaderItemList items={endItems} /> : <span></span>}
            </span>
        </header>
    )
}

function HeaderItemList({
    items,
    className = '',
}: {
    items: CompactHeaderItem[]
    className?: string
}): ReactNode {
    return (
        <span className={'flex flex-row flex-nowrap h-full gap-2 ' + className}>
            {items?.map((item, i) => (
                <HeaderItem key={i} {...item} />
            ))}
        </span>
    )
}

function HeaderItem({
    children,
    tooltip,
    onClick,
}: CompactHeaderItem): ReactNode {
    return (
        <Tooltip>
            <Tooltip.Trigger>
                <button className="cursor-pointer" onClick={onClick}>
                    {children}
                </button>
            </Tooltip.Trigger>
            <Tooltip.Content>
                <p>{tooltip}</p>
            </Tooltip.Content>
        </Tooltip>
    )
}
