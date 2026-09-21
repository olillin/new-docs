import Image from 'next/image'
import Link from 'next/link'

import itLogo from '@/app/assets/it-logo.png'

export function CompactHeader() {
    return (
        <header className="justify-space-between flex h-10 flex-row flex-nowrap items-center gap-2 bg-[#0a0a0a] px-4 py-2">
            <Link
                href="/"
                className="flex h-full flex-row flex-nowrap items-center gap-2"
            >
                <span className="relative aspect-square h-full overflow-hidden">
                    <Image
                        src={itLogo}
                        alt="Software Engineering Student Division Logo"
                        fill
                    />
                </span>
                <span className="text-lg font-bold tracking-tight">Docs</span>
            </Link>
        </header>
    )
}
