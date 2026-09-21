import { CompactHeader } from '../ui/CompactHeader'

export default function CompactLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <div className="grid h-screen max-h-screen min-h-screen grid-rows-[min-content_1fr]">
            <CompactHeader />
            <main>{children}</main>
        </div>
    )
}
