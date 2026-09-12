import { env } from '@/app/lib/env'

import { PixelnHeart } from './PixelnHeart'

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
                Made with <PixelnHeart /> by{' '}
                <a href="https://wiki.chalmers.it/Cal">Cal</a>.
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
