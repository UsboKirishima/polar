import * as CacheModule from '@polar/redis-manager'
import { createClient, RedisClientType } from 'redis'

export const redisClient: RedisClientType = createClient({
    url: process.env.REDIS_URL ?? 'redis://localhost:6379',
}) as RedisClientType

export const cacheManager = new CacheModule.default(redisClient)
cacheManager.connect()
