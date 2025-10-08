import * as trpcExpress from '@trpc/server/adapters/express';
import * as trpc from '@trpc/server';
import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from '../middlewares';

export const createContext = async (opts: trpcExpress.CreateExpressContextOptions) => {
    let user: JwtPayload | null = null;
    const authHeader = opts.req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        
        try {
            const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string) as JwtPayload;
            user = payload;
        } catch (err) {
            console.error('Token non valido:', (err as Error).message);
        }
    }
    return {
        req: opts.req,
        res: opts.res,
        user, 
    };
};

export type Context = Awaited<ReturnType<typeof createContext>>;