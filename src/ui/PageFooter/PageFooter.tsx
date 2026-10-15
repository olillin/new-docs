import Link from 'next/link'
import { Suspense, type ReactNode } from 'react'

import { env } from '@/lib/env'
import { getSession } from '@/lib/session'

import { PixelnHeart } from '../PixelnHeart'

const currentVersion = env.NEXT_PUBLIC_WEB_VERSION
const versionString = currentVersion
    ? currentVersion.match(/^[0-9]+\.[0-9]+/)
        ? `v${currentVersion}`
        : `version ${currentVersion}`
    : undefined

export function PageFooter() {
    return (
        <footer className="mt-12 mb-8">
            <p className="my-2 text-center">
                <span>
                    Made with <PixelnHeart /> by{' '}
                    <a href="https://wiki.chalmers.it/Cal">Cal</a>.
                </span>{' '}
                <Suspense fallback={<AdminLoginButton isAdmin={false} />}>
                    <AdminLoginButton />
                </Suspense>
            </p>
            <p className="my-2 text-center">
                Is something wrong or could be improved?&nbsp;
                <a href="https://github.com/olillin/new-docs/issues">
                    Leave an issue
                </a>{' '}
                on GitHub!
            </p>
            <p className="my-2 text-center">
                {versionString && `Docs ${versionString}. `}
                See the{' '}
                <a href="https://github.com/olillin/new-docs">source code</a> on
                GitHub.
            </p>
        </footer>
    )
}

export async function AdminLoginButton({
    isAdmin,
}: {
    isAdmin?: boolean
}): Promise<ReactNode> {
    if (isAdmin === undefined) {
        const session = await getSession()
        isAdmin = session?.is_admin
    }
    return isAdmin ? (
        <Link href="/admin">Admin page</Link>
    ) : (
        // This is a redirect which causes a CORS error when using Link.
        // oxlint-disable-next-line next/no-html-link-for-pages
        <a href="/oauth2/authorize">Admin login</a>
    )
}
