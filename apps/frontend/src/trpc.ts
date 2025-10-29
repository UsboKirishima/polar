import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '@polar/api';

const token = localStorage.getItem("token");

export const trpc = createTRPCProxyClient<AppRouter>({
    links: [
        httpBatchLink({
            url: 'http://localhost:3000/trpc',
            async headers() {
                return token ? { Authorization: `Bearer ${token}` } : {}
            }
        }),
    ],
});