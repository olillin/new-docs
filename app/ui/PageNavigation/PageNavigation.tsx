import { prisma } from '@/app/lib/prisma'

import { PageNavigationList } from './PageNavigationList'

export async function PageNavigation() {
    const categories = await prisma.category.findMany({
        orderBy: {
            priority: 'asc',
        },
    })

    return <PageNavigationList categories={categories} />
}
