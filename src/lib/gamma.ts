import { AuthorizationCode, ClientApi } from 'gammait'

import { env } from '@/environment'
import { createAbsoluteUrl } from '@/utils/url'

export function createGammaAuthorizationCode(): AuthorizationCode {
    const redirectUri: string =
        env.GAMMA_REDIRECT_URI ?? createAbsoluteUrl('/callback').href

    return new AuthorizationCode({
        clientId: env.GAMMA_CLIENT_ID,
        clientSecret: env.GAMMA_CLIENT_SECRET,
        redirectUri,
        scope: ['openid', 'profile'],
    })
}

export function createGammaClientApi(): ClientApi {
    return new ClientApi({
        authorization: `pre-shared ${env.GAMMA_API_KEY_ID}:${env.GAMMA_API_KEY_SECRET}`,
    })
}
