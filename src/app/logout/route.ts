import { NextResponse } from 'next/server'

import SessionService from '@/services/sessionService'
import { createAbsoluteUrl } from '@/utils/url'

export async function GET() {
    await SessionService.deleteSession()
    return NextResponse.redirect(createAbsoluteUrl('/'))
}
