import { db } from '@polar/db'

export const getBannerByUserId = async (userId: string) => {
    return await db.banner.findFirst({
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

export const uploadBanner = async (userId: string, bannerUrl: string) => {
    return await db.profile.update({
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
    })
}

export const deleteBanner = async (userId: string) => {
    const profile = await db.profile.findUnique({
        where: { userId },
        select: { bannerId: true },
    })

    if (!profile) {
        throw new Error('Profile not found for this user.')
    }

    if (!profile.bannerId) {
        throw new Error('This user has no banner to delete.')
    }

    return await db.$transaction([
        db.profile.update({
            where: { userId },
            data: { bannerId: null },
        }),
        db.banner.delete({
            where: { id: profile.bannerId },
        }),
    ])
}
