import { env } from "../env";
import { ServiceType } from "@polar/types/general";
import { createClient, RedisClientType } from "redis";

interface ConnectionOpts {
    cache_ttl?: number; // seconds
    max_retries?: number;
    retry_delay?: number; // ms
}

export default class CacheManager {
    private static instance: CacheManager | null = null;
    private readonly client: RedisClientType;
    private cache_ttl: number = 60;
    private max_retries: number = 5;
    private retry_delay: number = 1000;

    private constructor(connectionOptions?: ConnectionOpts) {
        this.client = createClient({
            url: env.REDIS_URL ?? "redis://localhost:6379",
        });

        if (connectionOptions?.cache_ttl)
            this.cache_ttl = connectionOptions.cache_ttl;
        if (connectionOptions?.max_retries)
            this.max_retries = connectionOptions.max_retries;
        if (connectionOptions?.retry_delay)
            this.retry_delay = connectionOptions.retry_delay;

        this.client.on("error", (err) => {
            console.error("[CacheManager] Redis error:", err);
        });
    }

    public static getInstance(opts?: ConnectionOpts): CacheManager {
        if (!CacheManager.instance)
            CacheManager.instance = new CacheManager(opts);
        return CacheManager.instance;
    }

    public async connect(): Promise<void> {
        if (this.client.isOpen) return;

        let attempts = 0;
        while (!this.client.isOpen && attempts < this.max_retries) {
            try {
                await this.client.connect();
                console.log("[CacheManager] Connected to Redis");
            } catch (err) {
                attempts++;
                const delay = this.retry_delay * Math.pow(2, attempts - 1);
                console.warn(
                    `[CacheManager] Connection failed (attempt ${attempts}/${this.max_retries}), retrying in ${delay}ms...`
                );
                await new Promise((res) => setTimeout(res, delay));
            }
        }

        if (!this.client.isOpen) {
            throw new Error("[CacheManager] Failed to connect to Redis after retries");
        }
    }

    public async setCache(key: ServiceType, content: string): Promise<void> {
        if (!this.client.isOpen) await this.connect();
        await this.client.set(key, content, { EX: this.cache_ttl });
    }

    public async getCache(key: ServiceType): Promise<string | null> {
        if (!this.client.isOpen) await this.connect();
        return await this.client.get(key);
    }

    public async deleteCache(key: ServiceType): Promise<void> {
        if (!this.client.isOpen) await this.connect();
        await this.client.del(key);
    }

    public async disconnect(): Promise<void> {
        if (this.client.isOpen) {
            await this.client.close();
            console.log("[CacheManager] Disconnected from Redis");
        }
    }
}
