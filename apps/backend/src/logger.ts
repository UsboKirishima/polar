import pino from 'pino'

import { env } from './env.js'

const level = env.NODE_ENV === 'production' ? 'info' : 'debug'

const logger = pino({
    level,
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true,
            translateTime: 'SYS:dd-mm-yyyy HH:MM:ss',
            ignore: 'pid,hostname',
        },
    },
})

export default logger
