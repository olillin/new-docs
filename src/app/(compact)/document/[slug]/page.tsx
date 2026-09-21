import { ErrorMessage } from '@heroui/react'

import { createAbsoluteUrl } from '@/lib/util'

type Params = { slug: string }

export const instant = false

export default async function Page(context: { params: Promise<Params> }) {
    const params = await context.params

    const url = `/api/document/${params.slug}`
    const exists = await fetch(createAbsoluteUrl(url + '/meta')).then(
        response => response.ok
    )

    if (!exists) {
        return <ErrorMessage>Unknown document</ErrorMessage>
    }

    return (
        <div className="h-full">
            <iframe src={url} width="100%" height="100%" />
        </div>
    )
}
