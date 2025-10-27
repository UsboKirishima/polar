import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { createClient } from "redis";
import CacheManager from "@polar/redis-manager";

interface TestData {
    name: string;
    age: number;
}

describe("CacheManager", () => {
    const redisClient = createClient({ url: "redis://localhost:6379" });
    const cache = new CacheManager(redisClient, { max_retries: 3, retry_delay: 200 });

    const testKey = "user:test";
    const testValue: TestData = { name: "Usbo", age: 21 };

    beforeAll(async () => {
        await cache.connect();
    });

    afterAll(async () => {
        await cache.delete(testKey);
        await cache.disconnect();
    });

    it("should connect to Redis successfully", async () => {
        expect(redisClient.isOpen).toBe(true);
    });

    it("should set a value in cache", async () => {
        await cache.set(testKey, testValue, { ttl: 2 });
        const raw = await redisClient.get(testKey);
        expect(raw).toBeTypeOf("string");
    });

    it("should get a parsed object from cache", async () => {
        const result = await cache.get<TestData>(testKey);
        expect(result).not.toBeNull();
        expect(result?.name).toBe("Usbo");
        expect(result?.age).toBe(21);
    });

    it("should delete a key from cache", async () => {
        await cache.delete(testKey);
        const result = await cache.get<TestData>(testKey);
        expect(result).toBeNull();
    });

    it("should handle invalid JSON gracefully", async () => {
        await redisClient.set(testKey, "invalid-json");
        const result = await cache.get<TestData>(testKey);
        expect(result).toBeNull();
    });
});
