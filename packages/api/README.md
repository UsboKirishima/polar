# API Package (`packages/api`)

This package is the heart of our API. It defines the tRPC router, which serves as the single source of truth for all API procedures. **This code *is* the API documentation.**

## Philosophy: API as Code

Unlike traditional REST or GraphQL APIs, we do not maintain separate API documentation (e.g., OpenAPI/Swagger). The tRPC router itself provides all the information needed to understand the API:

-   **Available Procedures:** The structure of the router object defines all available queries and mutations.
-   **Input Schemas:** Each procedure defines its input using a **Zod** schema. This provides runtime validation and infers the TypeScript type for the input.
-   **Output Types:** The return type of a procedure's resolver function is automatically inferred and made available to the client.
-   **Authentication:** The use of `publicProcedure` vs. `protectedProcedure` clearly documents which endpoints require authentication.

This approach guarantees that the client and server are always in sync. If a procedure's input or output changes, the TypeScript compiler will immediately flag any errors in the frontend code.

## Structure

The API is structured into multiple sub-routers which are then merged into a single `appRouter`.

```
packages/api/src/
├── root.ts         # Merges all sub-routers into the main appRouter
├── router/
│   ├── post.ts     # Defines the postRouter (e.g., create, get, delete)
│   ├── user.ts     # Defines the userRouter (e.g., getById, updateProfile)
│   └── ...         # Other sub-routers
├── trpc.ts         # Initializes tRPC and defines reusable procedures (public, protected)
└── context.ts      # Defines the tRPC context (e.g., user session, db connection)
```

## Defining Procedures

### Creating a Sub-Router
Each feature area should have its own router file in `packages/api/src/router/`.

### Adding a Query
A `query` is used for fetching data.

```typescript
// packages/api/src/router/post.ts
import { z } from 'zod';
import { publicProcedure, router } from '../trpc';

export const postRouter = router({
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      // ctx gives access to the database via Prisma
      const post = await ctx.db.post.findUnique({
        where: { id: input.id },
      });
      return post;
    }),
});
```

### Adding a Mutation
A `mutation` is used for creating, updating, or deleting data.

```typescript
// packages/api/src/router/post.ts
import { z } from 'zod';
import { protectedProcedure, router } from '../trpc';

export const postRouter = router({
  // ... other procedures
  create: protectedProcedure
    .input(
      z.object({
        content: z.string().min(1).max(280),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // `ctx.user` is available and typed because this is a protectedProcedure
      const post = await ctx.db.post.create({
        data: {
          content: input.content,
          authorId: ctx.user.id,
        },
      });
      return post;
    }),
});
```

## Frontend Client

The frontend application (`apps/frontend`) imports the `appRouter`'s **type definition**, not its implementation.
```typescript
// apps/frontend/src/utils/api.ts
import { httpBatchLink } from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '@polar/api'; // <-- Importing the TYPE

export const api = createTRPCReact<AppRouter>();
```
The `createTRPCReact` utility uses this type definition to create a fully-typed client and a set of React Query hooks (`api.post.getById.useQuery`, `api.post.create.useMutation`, etc.). This is how the end-to-end type safety is achieved.
