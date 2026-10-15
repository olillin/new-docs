import { NextResponse } from 'next/server'

import { createApiError } from '@/lib/responses'
import { verifySession } from '@/lib/session'

export async function GET() {
    let session
    try {
        session = await verifySession()
    } catch (e) {
        // A redirect means the user has not authorized
        const isRedirectError =
            typeof e === 'object' &&
            e !== null &&
            String((e as Record<string, unknown>).digest).includes(
                'NEXT_REDIRECT'
            )

        if (!isRedirectError) {
            console.error('Failed to verify session:', e)
        }

        return createApiError(401, 'Unauthorized')
    }

    return NextResponse.json(session)
}
