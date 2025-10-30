import pino from "pino";
const level = process.env.NODE_ENV === 'production' ? 'info' : 'debug';

const logger = pino({
    level: level,
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true,
            translateTime: 'SYS:dd-mm-yyyy HH:MM:ss',
            ignore: 'pid,hostname',
        },
    },
});

export default logger;