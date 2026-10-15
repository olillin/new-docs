import { fromBase32hex, toBase32hex } from '@exodus/bytes/base32.js'
import crypto from 'node:crypto'

import { prisma } from '@/lib/prisma'

export type SafeApiClient = {
    id: string
    name: string
    scope: string
}

export type ApiClientWithSecret = SafeApiClient & {
    secret: string
}

export type ApiClientWithSecretHash = SafeApiClient & {
    secretHash: string
    salt: string
}

export const supportedScopes = [
    'supercategory.create',
    'supercategory.list',
    'supercategory.read',
    'category.create',
    'category.list',
    'category.read',
    'document.create',
    'document.list',
    'document.read',
    'minutes.create',
    'minutes.read',
    'upload.create',
    'upload.read',
] as const
export type Scope = (typeof supportedScopes)[number]

/**
 * Check if a string is a valid scope.
 * @param maybeScope The string to check.
 * @returns If the scope is in the list of valid scopes.
 */
export function isScope(maybeScope: string): maybeScope is Scope {
    return (supportedScopes as readonly string[]).includes(maybeScope)
}

/**
 * Parse a scope string.
 * @param scope String containing scope separated by a spaces.
 * @returns The parsed scope list.
 * @throws If any scope is invalid.
 */
export function parseScope(scope: string): Scope[] {
    const splitScope = scope.split(' ')
    splitScope.forEach(maybeScope => {
        if (!isScope(maybeScope)) {
            throw new Error(`Unable to parse unknown scope '${maybeScope}'`)
        }
    })
    return splitScope as Scope[]
}

/**
 * Generate a random secret of a set length of bytes.
 * @param length The length of the secret to generate in bytes.
 * @returns The generated secret.
 */
function randomSecret(length: number): string {
    return toBase32hex(crypto.randomBytes(length))
}

async function hashSecret(
    secret: string,
    salt: Buffer<ArrayBufferLike>
): Promise<string> {
    return new Promise((resolve, reject) => {
        return crypto.argon2(
            'argon2id',
            {
                message: secret,
                nonce: salt,
                parallelism: 1,
                tagLength: 64,
                memory: 19456, // 19 MiB
                passes: 2,
            },
            (err, derivedKey) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(toBase32hex(derivedKey))
                }
            }
        )
    })
}

/**
 * Compare the secret to the hashed value.
 * @param secret The unhashed secret.
 * @param secretHash The hashed secret.
 * @param salt The salt the secret was hashed with.
 * @returns If the secret is the same.
 */
export async function checkClientSecret(
    secret: string,
    secretHash: string,
    salt: string | Buffer<ArrayBufferLike>
): Promise<boolean> {
    if (typeof salt === 'string') {
        salt = Buffer.from(fromBase32hex(salt))
    }
    const submittedHash = await hashSecret(secret, salt)
    return submittedHash === secretHash
}

export async function createApiClient(
    name: string,
    scope: Scope[]
): Promise<ApiClientWithSecret> {
    const secret = randomSecret(32)
    const salt = crypto.randomBytes(16)

    const storedSecret = await hashSecret(secret, salt)
    const storedSalt = toBase32hex(salt)
    const storedScope = scope.join(' ')

    return await prisma.apiClient.create({
        data: {
            name,
            // Store the hashed secret
            secret: storedSecret,
            salt: storedSalt,
            scope: storedScope,
        },
    })
}

export async function isApiClientNameTaken(name: string): Promise<boolean> {
    return prisma.apiClient
        .findFirst({
            where: { name },
        })
        .then(client => client !== null)
}

export async function getApiClient(id: string): Promise<SafeApiClient | null> {
    return await prisma.apiClient.findFirst({
        where: {
            id: id,
        },
        select: {
            id: true,
            name: true,
            scope: true,
        },
    })
}

export async function getApiClients(): Promise<SafeApiClient[]> {
    return await prisma.apiClient.findMany({
        select: {
            id: true,
            scope: true,
            name: true,
        },
    })
}

export async function getApiClientWithSecretHash(
    id: string
): Promise<ApiClientWithSecretHash | null> {
    const client = await prisma.apiClient.findFirst({
        where: {
            id: id,
        },
        select: {
            id: true,
            name: true,
            secret: true,
            salt: true,
            scope: true,
        },
    })
    if (client === null) return null
    return {
        id: client.id,
        name: client.name,
        salt: client.salt,
        secretHash: client.secret,
        scope: client.scope,
    }
}

export async function deleteApiClient(id: string): Promise<void> {
    return prisma.apiClient
        .deleteMany({
            where: {
                id,
            },
        })
        .then()
}
