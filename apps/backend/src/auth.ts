import { db } from '@polar/db';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';

/* Better Auth */
export const auth = betterAuth({
    database: prismaAdapter(db, {
        provider: 'mysql',
    }),
});
