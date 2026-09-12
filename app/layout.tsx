import type { Metadata, Viewport } from 'next'

import './globals.css'
import { ToastProvider } from '@heroui/react'
import { Suspense } from 'react'

import { PageFooter } from '@/app/ui/PageFooter'
import { PageNavigation } from '@/app/ui/PageNavigation'

import { prisma } from './lib/prisma'
import { PageNavigationSkeleton } from './ui/PageNavigationSkeleton'

export const metadata: Metadata = {
    title: 'IT Student Division Documents',
    description:
        'Documents belonging to the Software Engineering Student Division.',
}

export const viewport: Viewport = {
    themeColor: '#141414',
    colorScheme: 'dark',
}

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    'use cache'

    const categories = await prisma.category.findMany({
        select: {
            id: true,
            slug: true,
            svName: true,
            enName: true,
        },
        orderBy: {
            id: 'asc',
        },
    })

    return (
        <html lang="en">
            <body
                className="dark min-h-screen bg-[#141414] text-white"
                data-theme="dark"
            >
                <ToastProvider />
                <div className="mx-24 min-h-screen w-auto px-4 py-8 pb-16 md:px-0">
                    <header className="mb-6">
                        <h1 className="mb-2 text-2xl font-semibold tracking-tight md:text-4xl">
                            IT Student Division Documents
                        </h1>
                    </header>

                    <Suspense fallback={<PageNavigationSkeleton />}>
                        <PageNavigation categories={categories} />
                    </Suspense>
                    <main className="my-12">{children}</main>
                    <PageFooter />
                </div>
            </body>
        </html>
    )
}
