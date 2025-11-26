# Database Guide

This document provides a detailed overview of the database architecture, schema, and operational procedures for the Polar platform.

## Schema Management with Prisma

The database schema is the single source of truth for our data models. It is managed declaratively using the **Prisma Schema Language** in the following file:
`packages/db/schema.prisma`

This file defines all models, their fields, and the relationships between them. The Prisma client (`@prisma/client`), which provides a fully type-safe query builder, is generated from this schema.

## Migration Workflow

Database schema changes are managed through **Prisma Migrate**. This ensures that changes are tracked, version-controlled, and can be applied consistently across all environments.

### Development Workflow

1.  **Modify the Schema:** Make your desired changes to the `packages/db/schema.prisma` file.
2.  **Create a Migration:** Run the following command to generate a new SQL migration file and apply it to your local development database.
    ```bash
    pnpm --filter @polar/db exec prisma migrate dev --name <migration-name>
    ```
    - Replace `<migration-name>` with a short, descriptive name for the change (e.g., `add-post-tags`).
    - This command creates a new directory under `packages/db/prisma/migrations` containing the SQL for the migration.

### Production & Staging Workflow

Migrations are applied automatically by our CI/CD pipeline during the deployment process. The command used is:
```bash
pnpm --filter @polar/db exec prisma migrate deploy
```
This command applies all pending migrations that have not yet been run against the target database. It is non-interactive and designed for production environments. **Never run `migrate dev` in production.**

## Database Seeding

To populate your development database with realistic test data, you can use the Prisma seeding feature.

1.  **Define Seed Logic:** The seeding logic is located in `packages/db/prisma/seed.ts`. You can modify this file to add or change the seed data.
2.  **Run the Seed Command:**
    ```bash
    pnpm --filter @polar/db exec prisma db seed
    ```
This command will execute the `seed.ts` script, populating your database with the defined data. It is safe to run this command multiple times.
