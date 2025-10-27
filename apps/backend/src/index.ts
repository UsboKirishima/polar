import { env } from "./env.js";
import server from "./server.js";
import "./wss.js";
import chalk from "../../../packages/colors/source/index.js";
import CacheManager from "@polar/redis-manager";
import * as redis from 'redis';

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
    url: env.REDIS_URL ?? "redis://localhost:6379"
});
export const cacheManager = new CacheManager(redisClient, {
    max_retries: 5,
    retry_delay: 500
});

const port = env.PORT;
const serverListen = server.listen(port, () => {
    /* eslint-disable no-console */
    console.log(asciiArt)
    console.log(chalk.bgGreen.black(`Listening: http://localhost:${port}`));
    cacheManager.connect();
    /* eslint-enable no-console */
});

serverListen.on("error", (err) => {
    if ("code" in err && err.code === "EADDRINUSE") {
        console.error(`Port ${env.PORT} is already in use. Please choose another port or stop the process using it.`);
    }
    else {
        console.error("Failed to start server:", err);
    }
    process.exit(1);
});
