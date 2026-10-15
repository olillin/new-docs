import type { ReactNode } from 'react'

import Link from 'next/link'

import { CompactShell } from '@/ui/shell/compact/CompactShell'

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <CompactShell
            title="Docs Admin"
            endItems={[
                {
                    children: <Link href="/logout">Logout</Link>,
                },
            ]}
        >
            {children}
        </CompactShell>
    )
}
