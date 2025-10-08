import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { findUserAndProfileByUsername } from '../services/users.service';
import { Context } from './context';

export const t = initTRPC.context<Context>().create();

export const appRouter = t.router({
    hello: t.procedure
    .input(z.string())
    .query(({ input }) => {
        return {
            message: input
        }
    })
})

export type AppRouter = typeof appRouter;