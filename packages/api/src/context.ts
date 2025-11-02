import * as trpcExpress from '@trpc/server/adapters/express'
import * as jwt from 'jsonwebtoken'
import { JwtPayload } from '@polar/types'

export interface ContextType {
    req: trpcExpress.CreateExpressContextOptions['req']
    res: trpcExpress.CreateExpressContextOptions['res']
    user: JwtPayload | null
}

export const createContext = async (
    opts: trpcExpress.CreateExpressContextOptions
): Promise<ContextType> => {
    let user: JwtPayload | null = null
    const authHeader = opts.req.headers.authorization

    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1]

        if (token) {
            try {
                const payload = jwt.verify(
                    token,
                    process.env.JWT_ACCESS_SECRET as string
                ) as JwtPayload
                user = payload
            } catch (err) {
                console.error('Token not valid:', (err as Error).message)
            }
        }
    }
    return {
        req: opts.req,
        res: opts.res,
        user,
    }
}

export type Context = Awaited<ReturnType<typeof createContext>>
