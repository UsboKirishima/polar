import { db } from "../utils/db";

export const getAvatarByUserId = async (userId: string) => {
    return await db.avatar.findFirst({
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

export const uploadAvatar = async (userId: string, avatarUrl: string) => {
    return await db.profile.update({
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
    });
}

export const deleteAvatar = async (userId: string) => {
    const profile = await db.profile.findUnique({
        where: { userId },
        select: { avatarId: true },
    });

    if (!profile) {
        throw new Error("Profile not found for this user.");
    }

    if (!profile.avatarId) {
        throw new Error("This user has no avatar to delete.");
    }

    return await db.$transaction([
        db.profile.update({
            where: { userId },
            data: { avatarId: null },
        }),
        db.avatar.delete({
            where: { id: profile.avatarId },
        }),
    ]);
};
