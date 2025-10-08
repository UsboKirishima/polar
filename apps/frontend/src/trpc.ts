import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '@polar/backend';

export const trpc = createTRPCProxyClient<AppRouter>({
    links: [
        httpBatchLink({ url: 'http://localhost:3000/trpc' }),
    ],
});