export function joinPath(...parts: string[]): string {
    return parts.map(part => part.replace(/\/+$/, '')).join('/')
}

export function toIsoDateString(date: Date): string {
    return date.toISOString().replace(/T.+$/, '')
}
