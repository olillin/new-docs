import type { Metadata, Viewport } from 'next'

import './globals.css'
import { ToastProvider } from '@heroui/react'

export const metadata: Metadata = {
    title: 'IT Student Division Documents',
    description:
        'Documents belonging to the Software Engineering Student Division.',
}

export const viewport: Viewport = {
    themeColor: '#141414',
    colorScheme: 'dark',
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body
                className="dark min-h-screen bg-[#141414] text-white"
                data-theme="dark"
            >
                <ToastProvider />
                {children}
            </body>
        </html>
    )
}
