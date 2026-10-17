import { rpcClient as createRpcClient } from 'next-rest-framework/dist/client'

import type { RpcClient } from '@/app/api/rpc/[operationId]/route'

import { createAbsoluteUrl } from './url'

export const rpcUrl = createAbsoluteUrl('/api/rpc').href

export const rpcClient = createRpcClient<RpcClient>({
    url: rpcUrl,
})
