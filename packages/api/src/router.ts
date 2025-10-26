import { 
    authRouter, 
    categoryRouter, 
    friendRouter, 
    postRouter, 
    userRouter 
} from './routers';
import { t } from './trpc'

export const appRouter = t.router({
    user: userRouter,
    post: postRouter,
    friend: friendRouter,
    category: categoryRouter,
    auth: authRouter
});

export type AppRouter = typeof appRouter;