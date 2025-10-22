import { PostBgColor, PrismaClient, User } from "./generated/prisma";

declare global {
    var db: PrismaClient | undefined;
}

export const db =
    global.db ||
    new PrismaClient({
        log: ["query", "info", "warn", "error"],
    });

if (process.env.NODE_ENV !== "production") global.db = db;

export { PostBgColor, User };