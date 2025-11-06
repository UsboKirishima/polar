import { ClientClosedError, createClient, RedisClientOptions, RedisClientType } from "redis";

export interface CacheManagerOptions {
    max_retries?: number;
    retry_delay?: number; /* milliseconds */
}

export type CacheKey = string;

/**
 * Options required in set method
 */
export interface CacheSetOptions {
    ttl?: number;
}

/**
 * The relaxed type for the redis.createClient type.
 */
export type RedisInstance = RedisClientType;

/**
 * ## CacheManager
 * #### This class is a wrapper for redis, or the cache system in general.
 * 
 *  - 1. It handles the interaction with redis
 *  - 2. It provides methods and utilities.
 *  - 3. It handles connection and retries.
 *  - 4. It handles errors or problems.
 */
export default class CacheManager {
    /**
     * ### This attribute is the instance of the redis client.
     * @private
     * @type {RedisClientType}
     */
    private readonly client: RedisInstance;
    private _max_retries: number = 5;
    private _retry_delay: number = 1000;

    public constructor(client: RedisInstance, opts?: CacheManagerOptions) {
        if (opts?.max_retries)
            this.max_retries = opts.max_retries;
        if (opts?.retry_delay)
            this.retry_delay = opts.retry_delay;

        this.client = client as RedisClientType;
    }

    /**
     * ### Method to connect to redis server
     *
     * @return {*}  {Promise<void>}
     * @memberof CacheManager
     */
    public async connect(): Promise<void> {
        if (this.client.isOpen)
            return;

        let attempts = 0;
        while (!this.client.isOpen && attempts < this.max_retries) {
            try {
                await this.client.connect();
                this.cacheLog('log', 'Connected to redis');
            } catch (err) {
                attempts++;
                const delay = this.retry_delay * Math.pow(2, attempts - 1);
                this.cacheLog(
                    'warn',
                    `Connection failed (attempt ${attempts}/${this.max_retries}), retrying in ${delay}ms...`
                );
                await new Promise((res) => setTimeout(res, delay));
            }
        }


        if (!this.client.isOpen) {
            throw new Error("Failed to connect to Redis after retries");
        }
    }

    /**
     * ### Function to get a parsed object from cache.
     *
     * @template T
     * @param {CacheKey} key
     * @return {*}  {(Promise<T | null>)}
     * @memberof CacheManager
     */
    public async get<T>(key: CacheKey): Promise<T | null> {
        if (!this.client.isOpen)
            await this.connect();

        const data = await this.client.get(key);

        if (!data)
            return null;

        const parsedData = this.deserializeJSON<T>(data);

        return parsedData;
    }

    /**
     * ### Set cache content by key
     *
     * @param {CacheKey} key
     * @param {object} content
     * @param {CacheSetOptions} [opts]
     * @return {*}  {Promise<void>}
     * @memberof CacheManager
     */
    public async set(key: CacheKey, content: object, opts?: CacheSetOptions): Promise<void> {
        if (!this.client.isOpen)
            await this.connect();

        const parsedContent = this.serializeJSON(content);

        await this.client.set(key, parsedContent, {
            expiration: {
                type: 'EX',
                value: opts?.ttl ?? 1000
            }
        });
    }

    /**
     * ### Removes an object from redis by given key
     *
     * @param {CacheKey} key
     * @return {*}  {Promise<void>}
     * @memberof CacheManager
     */
    public async delete(key: CacheKey): Promise<void> {
        if (!this.client.isOpen)
            await this.connect();
        await this.client.del(key);
    }

    public async disconnect(): Promise<void> {
        if (!this.client.isOpen)
            return;

        this.client.quit();
        this.cacheLog('log', 'Disconnected from redis');
    }

    /* =================== Internals ================== */

    private serializeJSON(obj: object): string {
        return JSON.stringify(obj);
    }

    private deserializeJSON<T>(str: string): T | null {
        try {
            return JSON.parse(str) as T;
        } catch (e) {
            this.cacheLog('warn', 'Invalid JSON data in cache');
            return null;
        }
    }

    private cacheLog =
        (type: 'error' | 'log' | 'warn', msg: string): void => (type == 'error'
            ? console.error
            : type === 'log'
                ? console.log
                : console.warn)('[CACHE] ' + msg);

    /* ============ Getters and Setters ============= */

    /**
     * #### Retry delay time for redis connection (milliseconds).
     * @private
     * @type {number}
     * @memberof CacheManager
     */
    public get retry_delay(): number {
        return this._retry_delay;
    }

    public set retry_delay(value: number) {
        this._retry_delay = value;
    }

    /**
     * Max retries of connection to redis.
     * @private
     * @type {number}
     * @memberof CacheManager
     */
    public get max_retries(): number {
        return this._max_retries;
    }

    public set max_retries(value: number) {
        this._max_retries = value;
    }
}