import { appRouter, createContext } from '@polar/api'
import * as trpcExpress from '@trpc/server/adapters/express'
import cors from 'cors'
import express from 'express'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import morgan from 'morgan'

import type MessageResponse from './interfaces/message-response.js'

import * as middlewares from './middlewares.js'
import api from './routes/index.js'

const app = express()

/* Rate limiter setup */
const limiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000, // 24 Hours
    limit: 1000,
    message: {
        status: 429,
        error: 'Too many attempts. Try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
})

app.use(limiter)
app.use(morgan('dev'))
app.use(helmet())
app.use(cors())
app.use(express.json())

app.get<object, MessageResponse>('/', (req, res) => {
    res.json({
        message: 'Polar Api',
    })
})

app.use('/api/v1', api)

/* tRPC api route */
app.use(
    '/trpc',
    trpcExpress.createExpressMiddleware({
        router: appRouter,
        createContext,
    })
)

app.use(middlewares.notFound)
app.use(middlewares.errorHandler)

export default app
