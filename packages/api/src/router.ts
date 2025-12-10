import {
    authRouter,
    categoryRouter,
    friendRouter,
    postRouter,
    userRouter,
} from './routers/index.js'
import { t } from './trpc.js'

export const appRouter = t.router({
    user: userRouter,
    post: postRouter,
    friend: friendRouter,
    category: categoryRouter,
    auth: authRouter,
})

export type AppRouter = typeof appRouter
