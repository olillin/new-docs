import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    reactStrictMode: true,
    output: 'standalone',
    transpilePackages: ['@t3-oss/env-nextjs', '@t3-oss/env-core'],
    cacheComponents: true,
    partialPrefetching: true,
}

export default nextConfig
