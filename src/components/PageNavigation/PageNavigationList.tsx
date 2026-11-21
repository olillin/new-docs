'use client'

import type { Key } from 'react'
import type { ReactNode } from 'react'

import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export type PageNavigationItem = {
    id: Key
    slug: string
    svName: string
    enName: string
}

export function PageNavigationList({
    items,
}: {
    items?: PageNavigationItem[]
}) {
    const pathname = usePathname()

    return (
        <nav
            aria-label="Main navigation"
            className="order mb-8 flex gap-2 overflow-hidden rounded-4xl border-white/10 bg-[#0a0a0a] p-4"
        >
            <NavigationItem href="/" selected={pathname === '/'}>
                Home
            </NavigationItem>
            {items?.map(item => {
                const href = `/${item.slug}`

                return (
                    <NavigationItem
                        key={item.id}
                        href={href}
                        selected={pathname === href}
                    >
                        {item.svName}
                    </NavigationItem>
                )
            })}
        </nav>
    )
}

function NavigationItem({
    children,
    href,
    selected,
}: {
    children?: ReactNode
    href: string
    selected?: boolean
}) {
    return (
        <Link
            href={href}
            className={clsx(
                'flex flex-1 items-center justify-center rounded-2xl border-2 px-4 py-2 text-sm font-medium no-underline',
                {
                    'border-2 border-turkos text-turkos': selected,
                    'text-white/80 transition-colors hover:text-turkos':
                        !selected,
                }
            )}
        >
            {children}
        </Link>
    )
}
