import { ClientPageContent } from './ClientPageContent'

export const instant = false

type Params = { slug: string }

export default async function Page(context: { params: Promise<Params> }) {
    const params = await context.params
    return <ClientPageContent slug={params.slug} />
}
