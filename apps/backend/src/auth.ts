import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { db } from "./utils/db.js";

/* Better Auth */
export const auth = betterAuth({
    database: prismaAdapter(db, {
        provider: 'mysql'
    })
});