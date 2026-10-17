import { docsRoute } from 'next-rest-framework'

export const { GET } = docsRoute({
    openApiObject: {
        info: {
            title: 'IT Docs API',
            version: '1.0.0',
            description: 'Endpoints ',
        },
    },
})
