import * as trpcExpress from '@trpc/server/adapters/express';
import * as trpc from '@trpc/server';

export const createContext = ({
    req,
    res,
}: trpcExpress.CreateExpressContextOptions) => ({})

export type Context = Awaited<ReturnType<typeof createContext>>;