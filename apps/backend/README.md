# Backend Architecture (`apps/backend`)

This document provides a detailed overview of the backend service for the Polar platform.

## Core Responsibilities

The backend is the primary service that powers the platform's business logic. Its responsibilities include:
-   Serving the tRPC API for the frontend client.
-   Handling user authentication and authorization.
-   Processing all business logic (e.g., creating posts, managing friendships).
-   Interacting with the database (`PostgreSQL`) and cache (`Redis`).
-   Emitting real-time events via the WebSocket server.

## tRPC API Integration

The backend **does not use a traditional REST API**. Instead, it exposes a **tRPC API**, which provides end-to-end type safety.

-   **Server:** We use `express` as a standalone server to host the tRPC router. The router is attached to the `/trpc` endpoint using the `@trpc/server/adapters/express` adapter.
-   **Routers:** The API is structured into multiple routers, which are merged into a single `appRouter` in `packages/api`. For example, there might be a `postRouter`, `userRouter`, etc.
-   **Procedures:** Each router defines procedures, which can be a `query` (for reading data) or a `mutation` (for writing data).
-   **Request Flow:**
    1.  A tRPC request from the client hits the `/trpc` endpoint.
    2.  The tRPC Express adapter directs the request to the appropriate procedure in the `appRouter`.
    3.  The procedure's resolver function is executed. This function contains the business logic, often calling a service from `src/services`.

## Authentication & Authorization

Authentication is handled via a **tRPC middleware**. This allows us to create protected procedures that require a valid user session.

1.  **Middleware (`src/trpc/middleware.ts`):** A middleware function checks for a valid JWT in the request context, verifies it, and attaches the user to the context.
2.  **Protected Procedure:** We create a reusable `protectedProcedure` that incorporates this middleware. Any procedure built with this automatically enforces authentication.

**Example of a protected procedure:**
```typescript
// In packages/api/src/trpc.ts

import { initTRPC, TRPCError } from '@trpc/server';
import { type Context } from './context';

const t = initTRPC.context<Context>().create();

// Middleware to check for an authenticated user
const isAuthenticated = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: {
      // Infers the user as non-nullable
      user: ctx.user,
    },
  });
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthenticated);
```

Now, in any router, we can use `protectedProcedure` to require authentication:
```typescript
// In packages/api/src/router/post.ts
import { protectedProcedure, router } from '../trpc';

export const postRouter = router({
  createPost: protectedProcedure
    .input(/* Zod schema */)
    .mutation(async ({ ctx, input }) => {
      // ctx.user is guaranteed to be defined and typed here
      // ... logic to create a post
    }),
});
```

## WebSocket Layer (`src/wss.ts`)

The backend includes a WebSocket server for real-time communication with clients.
-   **Technology:** We use the `ws` library.
-   **Communication Protocol:** Messages are sent as structured JSON objects:
    ```json
    {
      "event": "event_name",
      "payload": { ... }
    }
    ```
-   **Events:** Common events include `new_notification`, `friend_request_accepted`, etc. When a relevant mutation occurs (e.g., a new friend request is created), the corresponding service is responsible for emitting an event to the relevant user(s).

## Environment Variables

The backend requires the following environment variables, defined in `.env`:

-   `DATABASE_URL`: Connection string for the PostgreSQL database.
-   `REDIS_URL`: Connection string for the Redis instance.
-   `JWT_SECRET`: A long, random string for signing JWTs.
-   `PORT`: The port the backend server will listen on (e.g., `4000`).
