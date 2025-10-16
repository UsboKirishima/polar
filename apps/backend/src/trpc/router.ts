import { initTRPC, TRPCError } from '@trpc/server';
import { z } from 'zod';
import { findUserAndProfileByUsername } from '../services/users.service';
import { Context } from './context';
import { userRouter } from './routers/user';

import { t } from './trpc'
import { postRouter } from './routers/post';

export const appRouter = t.router({
    user: userRouter,
    post: postRouter
})

export type AppRouter = typeof appRouter;