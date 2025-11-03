import 'dotenv/config';
import CacheManager from '@polar/redis-manager';
import chalk from 'chalk';

import './wss.js';
import * as redis from 'redis';

import { env } from './env.js';
import logger from './logger.js';
import server from './server.js';

const asciiArt = String.raw`                                     
__________      .__                
\______   \____ |  | _____ _______ 
 |     ___/  _ \|  | \__  \\_  __ \
 |    |  (  <_> )  |__/ __ \|  | \/
 |____|   \____/|____(____  /__|   
                          \/                         
`;

/* Cache system intialization */
const redisClient = redis.createClient({
    url: env.REDIS_URL ?? 'redis://localhost:6379',
});
export const cacheManager = new CacheManager(redisClient, {
    max_retries: 5,
    retry_delay: 500,
});

const port = env.PORT;
const serverListen = server.listen(port, () => {
    /* eslint-disable no-console */
    console.log(asciiArt);
    logger.info(chalk.bgGreen.black(`Listening: http://localhost:${port}`));
    cacheManager.connect();
    /* eslint-enable no-console */
});

serverListen.on('error', (err) => {
    if ('code' in err && err.code === 'EADDRINUSE') {
        logger.error(`Port ${env.PORT} is already in use. Please choose another port or stop the process using it.`);
    }
    else {
        logger.error(`Failed to start server: ${err}`);
    }
    process.exit(1);
});
