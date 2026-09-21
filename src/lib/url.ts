import { env } from '@/lib/env'

export function createAbsoluteUrl(path: string): URL {
    return new URL(path, env.BASE_URL)
}

export function createUploadUrl(hash: string): URL {
    return createAbsoluteUrl(`/api/upload/${hash}`)
}
