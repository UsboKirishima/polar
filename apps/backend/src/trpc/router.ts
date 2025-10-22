import { initTRPC, TRPCError } from '@trpc/server';
import { z } from 'zod';
import { findUserAndProfileByUsername } from '../services/users.service';
import { Context } from './context';
import { userRouter } from './routers/user';

import { t } from './trpc'
import { postRouter } from './routers/post';
import { friendRouter } from './routers/friend';

export const appRouter = t.router({
    user: userRouter,
    post: postRouter,
    friend: friendRouter
})

export type AppRouter = typeof appRouter;