import { createEnv } from '@t3-oss/env-nextjs'
import { readFileSync } from 'node:fs'
import * as z from 'zod'

export const defaultBaseUrl = 'http://localhost:3000'

function variableOrFile(
    name: string,
    o: NodeJS.ProcessEnv
): string | undefined {
    if (Object.hasOwn(o, name)) {
        return o[name]
    }
    const fileEnvName = name + '_FILE'
    if (Object.hasOwn(o, fileEnvName)) {
        const filename = o[fileEnvName]!
        return readFileSync(filename, 'utf8')
    }
}

export const env = createEnv({
    server: {
        NODE_ENV: z.enum(['production', 'development', 'test']),
        GAMMA_CLIENT_ID: z.string(),
        GAMMA_CLIENT_SECRET: z.string(),
        GAMMA_API_KEY_ID: z.string(),
        GAMMA_API_KEY_SECRET: z.string(),
        GAMMA_REDIRECT_URI: z.string().optional(),
        JWT_SECRET: z.string(),
        DATABASE_URL: z.string(),
    },
    shared: {
        BASE_URL: z
            .url({ normalize: true, protocol: /^https?$/ })
            .regex(/\/$/)
            .default(defaultBaseUrl),
        NEXT_PUBLIC_WEB_VERSION: z.string().optional(),
    },
    emptyStringAsUndefined: true,
    // Experimental settings infer runtime server variable values from names
    runtimeEnv: {
        NODE_ENV: variableOrFile('NODE_ENV', process.env),
        GAMMA_CLIENT_ID: variableOrFile('GAMMA_CLIENT_ID', process.env),
        GAMMA_CLIENT_SECRET: variableOrFile('GAMMA_CLIENT_SECRET', process.env),
        GAMMA_API_KEY_ID: variableOrFile('GAMMA_API_KEY_ID', process.env),
        GAMMA_API_KEY_SECRET: variableOrFile(
            'GAMMA_API_KEY_SECRET',
            process.env
        ),
        GAMMA_REDIRECT_URI: variableOrFile('GAMMA_REDIRECT_URI', process.env),
        JWT_SECRET: variableOrFile('JWT_SECRET', process.env),
        DATABASE_URL: variableOrFile('DATABASE_URL', process.env),
        BASE_URL: variableOrFile('BASE_URL', process.env),
        NEXT_PUBLIC_WEB_VERSION: process.env.NEXT_PUBLIC_WEB_VERSION,
    },
    // Skip validation with environment variable
    skipValidation: process.env.SKIP_ENV_VALIDATION === '1',
})
