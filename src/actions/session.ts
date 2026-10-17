'use server'

import gamma from 'gammait'
import { rpcOperation, TypedNextResponse } from 'next-rest-framework'
import z from 'zod'

import { createValidateTokenResponse } from '@/lib/api/middleware'
import { isAdmin } from '@/lib/gamma'
import { isUserJwtPayload, SessionInfo } from '@/lib/tokenDefinitions'

export const getSession = rpcOperation()
    .input({
        contentType: 'application/json',
        body: z.string(),
    })
    .outputs([
        {
            status: 200,
            contentType: 'application/json',
            body: SessionInfo.or(z.null()),
        },
    ])
    .handler(async token => {
        const tokenResponse = createValidateTokenResponse(token)
        if (tokenResponse instanceof TypedNextResponse) {
            return null
        }
        const parsedToken = tokenResponse.token
        if (!isUserJwtPayload(parsedToken)) {
            return null
        }

        const admin = await isAdmin(parsedToken.sub as gamma.UserId)
        return {
            ...parsedToken,
            is_admin: admin,
        } satisfies SessionInfo
    })
