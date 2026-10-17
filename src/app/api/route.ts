import { docsRoute } from 'next-rest-framework'

export const { GET } = docsRoute({
    deniedPaths: ['/logout', '/callback', '/oauth2/authorize'],
    openApiObject: {
        info: {
            title: 'IT Docs API',
            version: '1.0.0',
            description: 'Endpoints ',
        },
    },
    docsConfig: {
        provider: 'swagger-ui',
    },
})
