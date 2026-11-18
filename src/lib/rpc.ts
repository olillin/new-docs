import { rpcClient as createRpcClient } from 'next-rest-framework/dist/client'

import type { RpcClient } from '@/app/api/rpc/[operationId]/route'

export const rpcUrl = '/api/rpc'

export const rpcClient = createRpcClient<RpcClient>({
    url: rpcUrl,
})
