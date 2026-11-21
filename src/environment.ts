import { createEnv } from '@t3-oss/env-nextjs'
import { readFileSync } from 'node:fs'
import * as z from 'zod'

export const defaultBaseUrl = 'http://localhost:3000'
export const defaultUploadsDirectory = './uploads/'

function variableOrFile(
    name: string,
    o: NodeJS.ProcessEnv = process.env
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
        JWT_EXPIRES_IN: z.string().optional(),
        JWT_ISSUER: z.string().optional(),
        DATABASE_URL: z.string(),
        UPLOADS_DIRECTORY: z.string().default(defaultUploadsDirectory),
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
        NODE_ENV: variableOrFile('NODE_ENV'),
        GAMMA_CLIENT_ID: variableOrFile('GAMMA_CLIENT_ID'),
        GAMMA_CLIENT_SECRET: variableOrFile('GAMMA_CLIENT_SECRET'),
        GAMMA_API_KEY_ID: variableOrFile('GAMMA_API_KEY_ID'),
        GAMMA_API_KEY_SECRET: variableOrFile('GAMMA_API_KEY_SECRET'),
        GAMMA_REDIRECT_URI: variableOrFile('GAMMA_REDIRECT_URI'),
        JWT_SECRET: variableOrFile('JWT_SECRET'),
        JWT_EXPIRES_IN: variableOrFile('JWT_EXPIRES_IN'),
        JWT_ISSUER: variableOrFile('JWT_ISSUER'),
        DATABASE_URL: variableOrFile('DATABASE_URL'),
        UPLOADS_DIRECTORY: variableOrFile('UPLOADS_DIRECTORY'),
        BASE_URL: variableOrFile('BASE_URL'),
        NEXT_PUBLIC_WEB_VERSION: process.env.NEXT_PUBLIC_WEB_VERSION,
    },
    // Skip validation with environment variable
    skipValidation: process.env.SKIP_ENV_VALIDATION === '1',
})
