import { NextFunction, Request, Response } from "express";

import type ErrorResponse from "./interfaces/error-response.js";

import { env } from "./env.js";
import * as jwt from 'jsonwebtoken';
import 'dotenv/config.js';

export function notFound(req: Request, res: Response, next: NextFunction) {
    res.status(404);
    const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
    next(error);
}

export function errorHandler(err: Error, req: Request, res: Response<ErrorResponse>, _next: NextFunction) {
    const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: env.NODE_ENV === "production" ? "🥞" : err.stack,
    });
}

interface JwtPayload {
    userId: string;
    iat: number;
    exp: number;
}

export interface AuthenticatedRequest extends Request {
    payload?: JwtPayload;
}

export function isAuthenticated(req: Request, res: Response, next: NextFunction): void {
    const { authorization } = req.headers;

    if (!authorization) {
        res.status(401);
        throw new Error('🚫 Un-Authorized 🚫');
    }

    try {
        const token = authorization.split(' ')[1];
        const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string);
        req.payload = payload;

    } catch (err: any) {
        res.status(401);
        if (err.name === 'TokenExpiredError') {
            throw new Error(err.name);
        }
        throw new Error('🚫 Un-Authorized 🚫');
    }

    return next();
}