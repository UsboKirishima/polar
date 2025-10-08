import { initTRPC, TRPCError } from '@trpc/server';
import { z } from 'zod';
import { findUserAndProfileByUsername } from '../services/users.service';
import { Context } from './context';
import { userRouter } from './routers/user';

import { t } from './trpc'

export const appRouter = t.router({
    user: userRouter
})

export type AppRouter = typeof appRouter;