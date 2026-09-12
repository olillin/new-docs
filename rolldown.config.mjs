import { defineConfig } from 'rolldown'

export default defineConfig({
    platform: 'node',
    input: 'prisma/seed.ts',
    output: {
        dir: 'bundle',
        format: 'esm',
        comments: false,
    },
    transform: {
        typescript: {
            onlyRemoveTypeImports: true,
        },
    },
    tsconfig: true,
})
