import Image from 'next/image'
import { Suspense } from 'react'

import itLogo from '@/assets/it-logo.png'
import { PageFooter } from '@/ui/PageFooter/PageFooter'
import { PageNavigation } from '@/ui/PageNavigation/PageNavigation'
import { PageNavigationSkeleton } from '@/ui/PageNavigation/PageNavigationSkeleton'

export default function HomeLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <div className="mx-auto min-h-screen w-auto max-w-6xl min-w-1/3 px-12 py-8 pb-16">
            <header className="relative mb-8 flex flex-row flex-nowrap items-center">
                <Image
                    src={itLogo}
                    alt="Software Engineering Student Division Logo"
                    height="128"
                    className="mr-4 h-16 w-16"
                />
                <hgroup>
                    <h1 className="inline align-middle text-2xl font-semibold tracking-tight md:text-4xl">
                        IT Division Documents
                    </h1>
                    <p className="text-neutral-400">
                        The Software Engineering Student Division
                    </p>
                </hgroup>
            </header>

            <Suspense fallback={<PageNavigationSkeleton />}>
                <PageNavigation />
            </Suspense>

            <main className="my-12">{children}</main>

            <PageFooter />
        </div>
    )
}
