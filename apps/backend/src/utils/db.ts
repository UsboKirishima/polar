import { PrismaClient } from "../generated/prisma";

export const db = new PrismaClient();

async function main() {
  // ... Prisma client queries
}

main()
  .then(async () => {
    await db.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await db.$disconnect()
    process.exit(1)
  })