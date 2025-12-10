import { db } from '@polar/db'
import { cacheManager } from './cache.js'

const CACHE_TTL = 60 // Expiriation value (60 seconds)
const CACHE_KEYS = {
    userAvatar: (userId: string) => `userAvatar:${userId}`,
}

export const __getAvatarByUserId = async (userId: string) => {
    return await db.avatar.findFirst({
        where: {
            profile: {
                user: {
                    id: userId,
                },
            },
        },
        select: {
            id: true,
            url: true,
            createdAt: true,
            updatedAt: true,
        },
    })
}

export const getAvatarByUserId = async (userId: string) => {
    const cacheKey = CACHE_KEYS.userAvatar(userId)
    const cached =
        await cacheManager.get<ReturnType<typeof __getAvatarByUserId>>(cacheKey)

    if (cached) {
        return cached
    }

    const avatar = await __getAvatarByUserId(userId)

    if (avatar) {
        await cacheManager.set(cacheKey, avatar, {
            ttl: CACHE_TTL,
        })
    }

    return avatar
}

export const uploadAvatar = async (userId: string, avatarUrl: string) => {
    const cacheKey = CACHE_KEYS.userAvatar(userId)

    const result = await db.profile.update({
        where: {
            userId,
        },
        data: {
            avatar: {
                upsert: {
                    update: {
                        url: avatarUrl,
                        updatedAt: new Date(),
                    },
                    create: {
                        url: avatarUrl,
                    },
                },
            },
        },
        include: {
            avatar: true,
        },
    })

    await cacheManager.delete(cacheKey)

    return result
}

export const deleteAvatar = async (userId: string) => {
    const cacheKey = CACHE_KEYS.userAvatar(userId)

    const profile = await db.profile.findUnique({
        where: { userId },
        select: { avatarId: true },
    })

    if (!profile) {
        throw new Error('Profile not found for this user.')
    }

    if (!profile.avatarId) {
        throw new Error('This user has no avatar to delete.')
    }

    const result = await db.$transaction([
        db.profile.update({
            where: { userId },
            data: { avatarId: null },
        }),
        db.avatar.delete({
            where: { id: profile.avatarId },
        }),
    ])

    await cacheManager.delete(cacheKey)

    return result
}
