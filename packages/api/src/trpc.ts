import { initTRPC, TRPCError } from '@trpc/server';
import { Context } from './context';
import { transformer } from './transformer';

export const t = initTRPC.context<Context>().create({
    transformer: transformer
});

export const publicProcedure = t.procedure;
export const protectedProcedure = publicProcedure.use(async (opts) => {
    if (!opts.ctx.user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    return opts.next({
        ctx: {
            user: opts.ctx.user,
        },
    });
});
