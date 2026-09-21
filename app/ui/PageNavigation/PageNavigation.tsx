import { prisma } from '@/app/lib/prisma'

import { PageNavigationItem, PageNavigationList } from './PageNavigationList'

export async function PageNavigation() {
    const superCategories = await prisma.superCategory.findMany({
        orderBy: {
            priority: 'asc',
        },
    })

    const items: PageNavigationItem[] = superCategories.map(category => ({
        ...category,
        slug: 'category/' + category.slug,
    }))

    return <PageNavigationList items={items} />
}
