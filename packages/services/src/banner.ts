import { db } from "@polar/db";
import { cacheManager } from "./cache";

const CACHE_TTL = 60; // Expiriation value (60 seconds)
const CACHE_KEYS = {
    userBanner: (userId: string) => `userBanner:${userId}`
}

export const __getBannerByUserId = async (userId: string) => {
    return await db.banner.findFirst({
        where: {
            profile: {
                user: {
                    id: userId
                }
            }
        },
        select: {
            id: true,
            url: true,
            createdAt: true,
            updatedAt: true
        }
    })
}

export const getBannerByUserId = async (userId: string) => {
    const cacheKey = CACHE_KEYS.userBanner(userId);
    const cached = await cacheManager.get<ReturnType<typeof __getBannerByUserId>>(cacheKey);

    if (cached) {
        return cached;
    }

    const banner = await __getBannerByUserId(userId);

    if (banner) {
        await cacheManager.set(cacheKey, banner, {
            ttl: CACHE_TTL
        });
    }

    return banner;
}

export const uploadBanner = async (userId: string, bannerUrl: string) => {
    const cacheKey = CACHE_KEYS.userBanner(userId);

    const result = await db.profile.update({
        where: {
            userId,
        },
        data: {
            banner: {
                upsert: {
                    update: {
                        url: bannerUrl,
                        updatedAt: new Date(),
                    },
                    create: {
                        url: bannerUrl,
                    },
                },
            },
        },
        include: {
            banner: true,
        },
    });

    await cacheManager.delete(cacheKey);

    return result;
}

export const deleteBanner = async (userId: string) => {
    const cacheKey = CACHE_KEYS.userBanner(userId);

    const profile = await db.profile.findUnique({
        where: { userId },
        select: { bannerId: true },
    });

    if (!profile) {
        throw new Error("Profile not found for this user.");
    }

    if (!profile.bannerId) {
        throw new Error("This user has no banner to delete.");
    }

    const result = await db.$transaction([
        db.profile.update({
            where: { userId },
            data: { bannerId: null },
        }),
        db.banner.delete({
            where: { id: profile.bannerId },
        }),
    ]);

    await cacheManager.delete(cacheKey);

    return result;
};
