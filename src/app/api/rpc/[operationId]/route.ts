import { rpcRoute } from 'next-rest-framework'

import { getDocumentBySlug } from '@/actions/documents'
import { getSession } from '@/actions/session'

export const { POST } = rpcRoute({
    getDocumentBySlug,
    getSession,
})

export type RpcClient = typeof POST.client
