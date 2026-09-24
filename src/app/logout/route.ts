import { NextResponse } from 'next/server'

import { deleteSession } from '@/lib/session'
import { createAbsoluteUrl } from '@/lib/url'

export async function GET() {
    await deleteSession()
    return NextResponse.redirect(createAbsoluteUrl('/'))
}
