import { defineConfig, env } from 'prisma/config'

export default defineConfig({
    schema: 'packages/db/src/schema.prisma',
    datasource: {
        url: env('DATABASE_URL'),
    },
})
