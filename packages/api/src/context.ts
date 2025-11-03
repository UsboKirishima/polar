import * as trpcExpress from '@trpc/server/adapters/express';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from '@polar/types';

export interface ContextType {
    req: trpcExpress.CreateExpressContextOptions['req'];
    res: trpcExpress.CreateExpressContextOptions['res'];
    user: JwtPayload | null;
}

export const createContext = async (
    opts: trpcExpress.CreateExpressContextOptions
): Promise<ContextType> => {
    let user: JwtPayload | null = null;
    const authHeader = opts.req.headers.authorization;
    const secret = process.env.JWT_ACCESS_SECRET;

    if (!secret) {
        throw new Error('JWT_ACCESS_SECRET is not defined');
    }

    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];

        try {
            if (token === undefined) throw new Error('Token not found');

            const payload = jwt.verify(token, secret);

            if (typeof payload === 'object' && payload !== null && 'userId' in payload) {
                user = payload as JwtPayload;
            }
        } catch (err) {
            console.error('Token not valid:', (err as Error).message);
        }
    }

    return {
        req: opts.req,
        res: opts.res,
        user,
    };
};

export type Context = Awaited<ReturnType<typeof createContext>>;
