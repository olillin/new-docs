import { route, routeOperation, TypedNextResponse } from 'next-rest-framework'

import { validateTokenMiddleware } from '@/lib/api/middleware'
import { createApiErrorOutputs } from '@/lib/api/responses'
import { TokenResponse } from '@/lib/api/schemas'

export const { GET } = route({
    whoami: routeOperation({
        method: 'GET',
    })
        .outputs([
            {
                status: 200,
                contentType: 'application/json',
                body: TokenResponse,
            },
            ...createApiErrorOutputs([401] as const),
        ])
        .middleware(validateTokenMiddleware)
        .handler((_res, _ctx, { token }) => {
            return TypedNextResponse.json(token)
        }),
})
