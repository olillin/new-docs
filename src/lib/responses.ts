import { NextResponse } from 'next/server'

import type { JwtWithToken } from './tokenDefinitions'

export function createApiError(code: number, message: string): NextResponse {
    return NextResponse.json({ error: { message, code } }, { status: code })
}

export function createJwtResponse(jwt: JwtWithToken): NextResponse {
    return NextResponse.json(jwt, { status: 200 })
}
