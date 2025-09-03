import { userBasicSchema, userSchema } from "../types/zod";
import { Request, Response, NextFunction } from 'express';

export const validateLoginData = (request: Request, response: Response, next: NextFunction) => {
    try {
        const data = request.body;
        userSchema.parse(data);
        next();
    } catch (error) {
        next(error);
    }
};