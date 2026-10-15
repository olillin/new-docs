import { userAvatarUrl } from 'gammait/urls'
import { NextRequest, NextResponse } from 'next/server'

import { createGammaAuthorizationCode } from '@/lib/gamma'
import { createSession, deleteState, readState } from '@/lib/session'
import { signUserJwtPayload } from '@/lib/token'
import { createAbsoluteUrl } from '@/lib/url'

export async function GET(req: NextRequest) {
    const code = req.nextUrl.searchParams.get('code')
    if (code == null) {
        return new NextResponse(
            '401 Unauthorized: Missing authorization code',
            {
                status: 401,
            }
        )
    }

    const state = req.nextUrl.searchParams.get('state')
    if (state == null) {
        return new NextResponse('401 Unauthorized: Missing state', {
            status: 401,
        })
    }

    const storedState = await readState()
    if (!storedState) {
        return new NextResponse(
            '401 Unauthorized: State has expired, please try again',
            {
                status: 401,
            }
        )
    }

    if (state !== storedState) {
        return new NextResponse(
            '401 Unauthorized: Provided state does not match the stored value, please try again later',
            {
                status: 401,
            }
        )
    }

    await deleteState()

    const authorizationCode = createGammaAuthorizationCode()
    try {
        await authorizationCode.generateToken(code).catch(reason => {
            throw new Error(String(reason))
        })
    } catch (error) {
        return new NextResponse(
            `500 Internal Server Error: Failed to generate access token, code may already be used. Details: ${String(error)}`,
            { status: 500 }
        )
    }

    const userInfo = await authorizationCode.userInfo()

    // Create a new session
    const jwt = await signUserJwtPayload({
        sub: userInfo.sub,
        nickname: userInfo.nickname,
        picture: userAvatarUrl(userInfo.sub),
    })
    await createSession(jwt)

    // Redirect to homepage
    return NextResponse.redirect(createAbsoluteUrl('/admin'))
}
