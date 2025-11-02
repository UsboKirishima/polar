import type { JwtPayload } from '@polar/types'
import type { NextFunction, Request, Response } from 'express'

import * as jwt from 'jsonwebtoken'

import type ErrorResponse from './interfaces/error-response.js'
import 'dotenv/config.js'

import { env } from './env.js'

export function notFound(req: Request, res: Response, next: NextFunction) {
    res.status(404)
    const error = new Error(`- Not Found - ${req.originalUrl}`)
    next(error)
}

export function errorHandler(
    err: Error,
    req: Request,
    res: Response<ErrorResponse>,
    _next: NextFunction
) {
    const statusCode = res.statusCode !== 200 ? res.statusCode : 500
    res.status(statusCode)
    res.json({
        message: err.message,
        stack: env.NODE_ENV === 'production' ? '🥞' : err.stack,
    })
}

export type AuthenticatedRequest = {
    payload?: JwtPayload
} & Request

export function isAuthenticated(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    const { authorization } = req.headers

    if (!authorization) {
        res.status(401)
        throw new Error('Un-Authorized')
    }

    try {
        const token = authorization.split(' ')[1]
        if (!token) {
            res.status(401).json({ message: 'Token is required' })
            return
        }

        const payload = jwt.verify(
            token,
            env.JWT_ACCESS_SECRET as string
        ) as JwtPayload
        req.payload = payload
    } catch (err: any) {
        res.status(401)
        if (err.name === 'TokenExpiredError') {
            throw new Error(err.name)
        }
        throw new Error('Un-Authorized')
    }

    return next()
}
