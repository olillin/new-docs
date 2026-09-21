import { env } from '@/lib/env'

export function joinPath(...parts: string[]): string {
    return parts.map(part => part.replace(/\/+$/, '')).join('/')
}

export function toIsoDateString(date: Date): string {
    return date.toISOString().replace(/T.+$/, '')
}

export function createAbsoluteUrl(path: string): URL {
    return new URL(path, env.BASE_URL)
}

export function createUploadUrl(hash: string): URL {
    return new URL(`/api/upload/${hash}`, env.BASE_URL)
}
