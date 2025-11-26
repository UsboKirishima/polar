# Frontend Architecture (`apps/frontend`)

This document provides a detailed overview of the frontend application for the Polar platform.

## Core Responsibilities

The frontend is a modern Single Page Application (SPA) that provides the user interface for the platform. Its responsibilities include:
-   Rendering the user interface using a component-based architecture.
-   Handling user input and interactions.
-   Communicating with the backend via a type-safe tRPC client.
-   Managing client-side state.

## Component Architecture

We follow a pragmatic version of **Atomic Design** to structure our React components. This promotes reusability and a clear separation of concerns.

-   `src/components/ui/`:
    **Atoms/Molecules.** These are basic, highly reusable UI components that are agnostic to business logic. Examples: `Button`, `Input`, `Card`, `Avatar`, `Tooltip`.

-   `src/components/features/`:
    **Organisms.** These are more complex components that are tied to a specific application feature. They often compose components from `ui/` and manage feature-specific logic. Examples: `CreatePostForm`, `FriendRequestList`, `PostCard`.

-   `src/layouts/`:
    **Templates.** These components define the overall structure of a page, such as a main layout with a header and sidebar or an authentication layout for login pages.

-   `src/pages/`:
    **Pages.** These components assemble layouts and feature components to create the final views that users interact with.

## State Management Strategy

We have a clear separation between server state and client state.

-   **Server Cache State (React Query):**
    All data fetched from the backend is managed by **React Query** via the `@trpc/react-query` helper. This handles caching, background refetching, invalidation, and optimistic updates automatically. It is the "source of truth" for all server data.

-   **Global UI State (Zustand):**
    For global client-side state that is not persisted on the server, we use **Zustand**. It is used for things like theme (dark/light mode), modal visibility, or storing the current user session info. Zustand stores are lightweight, simple, and easy to test.

## tRPC Client Usage

The frontend communicates with the backend using a fully type-safe tRPC client. This eliminates the need to write API fetching logic manually and provides compile-time guarantees that the frontend and backend are in sync.

1.  **tRPC Provider:** The root of the application is wrapped in a tRPC provider, which configures the client and React Query.

2.  **Calling Procedures:** We use hooks provided by `@trpc/react-query` to call API procedures. These hooks behave just like React Query's hooks but are fully typed based on our API router.

**Example of fetching data with a tRPC query:**
```tsx
// src/components/features/PostList.tsx
import { api } from '~/utils/api'; // The configured tRPC client

export function PostList() {
  // The 'post.getAll' path is fully typed and autocompleted.
  // The `data` is inferred as `Post[]` and `isLoading` is a boolean.
  const { data: posts, isLoading, error } = api.post.getAll.useQuery();

  if (isLoading) {
    return <div>Loading posts...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
```

**Example of creating data with a tRPC mutation:**
```tsx
// src/components/features/CreatePostForm.tsx
import { api } from '~/utils/api';

export function CreatePostForm() {
  const utils = api.useContext();

  const createPostMutation = api.post.create.useMutation({
    onSuccess: () => {
      // Invalidate the query for posts to refetch the list
      utils.post.getAll.invalidate();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const content = // get content from form input
    // The input is type-checked against the Zod schema defined in the backend.
    createPostMutation.mutate({ content });
  };

  // ... form JSX
}
```

## Styling

We use **Tailwind CSS** for styling. This utility-first CSS framework allows us to build complex, responsive layouts directly in our JSX, enforced by a consistent design system defined in `tailwind.config.js`.
