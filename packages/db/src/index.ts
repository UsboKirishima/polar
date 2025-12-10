import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

/* eslint-disable-next-line node/prefer-global/process */
const connectionString = process.env.DATABASE_URL as string

const url = new URL(connectionString)
const adapter = new PrismaMariaDb({
    host: url.hostname,
    port: Number.parseInt(url.port) || 3306,
    user: url.username,
    password: url.password,
    database: url.pathname.replace(/^\//, ''),
})

export const db
  = globalForPrisma.prisma
      ?? new PrismaClient({
          log:
      /* eslint-disable-next-line node/prefer-global/process */
      process.env.NODE_ENV === 'development'
          ? ['query', 'error', 'warn']
          : ['error'],
          adapter,
      })

/* eslint-disable-next-line node/prefer-global/process */
if (process.env.NODE_ENV !== 'production')
    globalForPrisma.prisma = db

export * from '@prisma/client';