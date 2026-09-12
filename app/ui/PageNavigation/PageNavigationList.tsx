'use client'

import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

import { Category } from '@/app/generated/prisma/browser'

export function PageNavigationList({
    categories,
}: {
    categories?: Category[]
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
            {categories?.map(category => {
                const href = `/${category.slug}`

                return (
                    <NavigationItem
                        key={category.id}
                        href={href}
                        selected={pathname === href}
                    >
                        {category.svName}
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
