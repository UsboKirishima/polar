import type { NextFunction, Request, Response } from 'express';

import { userSchema } from '@polar/types/zod';

/**
 * @deprecated Use tRPC API instead
 */
export function validateLoginData(
    request: Request,
    response: Response,
    next: NextFunction,
) {
    try {
        const data = request.body;
        userSchema.parse(data);
        next();
    }
    catch (error) {
        next(error);
    }
}
