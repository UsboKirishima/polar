import { PrismaClient } from '@prisma/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

const connectionString = process.env.DATABASE_URL as string;

const url = new URL(connectionString)
const adapter = new PrismaMariaDb({
  host: url.hostname,
  port: parseInt(url.port) || 3306,
  user: url.username,
  password: url.password,
  database: url.pathname.replace(/^\//, ''),
})

export const db
    = globalForPrisma.prisma
    ?? new PrismaClient({
        log:
            process.env.NODE_ENV === 'development'
                ? ['query', 'error', 'warn']
                : ['error'],
        adapter: adapter
    })

if (process.env.NODE_ENV !== 'production')
    globalForPrisma.prisma = db

export { PostBgColor } from '@prisma/client'
export type { User } from '@prisma/client'
