import bcrypt from "bcrypt";

import type { SimpleProfileSchema, SimpleUserSchema } from "@polar/types/general.js";
import { db, User } from "@polar/db";

export function findUserByEmail(email: string) {
    return db.user.findUnique({
        where: {
            email,
        },
    });
}

type UserMailNPassword = {
    email: string;
    password: string;
};

export function createUserByEmailAndPassword(user: UserMailNPassword) {
    user.password = bcrypt.hashSync(user.password, 12);
    return db.user.create({
        data: user,
    });
}

export async function createUserWithProfile(user: Omit<SimpleUserSchema, "profile.bio"> & { profile: Omit<SimpleProfileSchema, "bio"> }) {
    const hashedPassword = bcrypt.hashSync(user.password, 12);
    return await db.user.create({
        data: {
            email: user.email,
            password: hashedPassword,
            profile: {
                create: {
                    username: user.profile.username,
                    dateOfBirth: new Date(user.profile.dateOfBirth),
                    fullName: user.profile.fullName,
                    // bio not included, prisma will use default param
                },
            },
        },
    });
}

export async function createProfile(profile: SimpleProfileSchema, userId: string) {
    return await db.profile.create({
        data: {
            username: profile.username,
            dateOfBirth: new Date(profile.dateOfBirth),
            fullName: profile.fullName,
            bio: profile.bio ?? "unknown",
            userId,
        },
    });
}

export async function findUserById(id: string) {
    return await db.user.findUnique({
        where: {
            id,
        },
    });
}

export async function findProfileById(profileId: string) {
    return await db.profile.findUnique({
        where: {
            id: profileId,
        },
    });
}

export async function findUserAndProfileById(userId: string) {
    return await db.user.findUnique({
        where: { id: userId },
        include: {
            likes: {
                include: {
                    post: {
                        include: {
                            author: {
                                select: {
                                    id: true,
                                    profile: {
                                        include: {
                                            avatar: true,
                                            banner: true,
                                        }
                                    },
                                    password: false,
                                },
                            },
                            likes: true,
                            comments: true
                        }
                    },
                }
            },
            comments: {
                include: {
                    post: {
                        include: {
                            author: {
                                select: {
                                    id: true,
                                    profile: {
                                        include: {
                                            avatar: true,
                                            banner: true,
                                        },
                                    },
                                    password: false,
                                },
                            },
                            likes: true,
                            comments: true
                        }
                    },
                }
            },
            profile: {
                include: {
                    avatar: true,
                    banner: true,
                },
            },
        },
    });
}

export async function findUserAndProfileByUsername(username: string) {
    return await db.user.findFirst({
        where: {
            profile: {
                is: {
                    username,
                },
            },
        },
        include: {
            profile: {
                include: {
                    avatar: true,
                    banner: true,
                },
            },
        },
    });
}

export async function findAllFriendsByUserId(userId: string) {
    return await db.user.findUnique({
        where: { id: userId },
        include: {
            friends: {
                include: {
                    friend: {
                        select: {
                            id: true,
                            email: true,
                            role: true,
                            createdAt: true,
                            updatedAt: true,
                            profile: {
                                include: {
                                    avatar: true,
                                    banner: true,
                                },
                            },
                        },
                    },
                },
            },
        },
    });
}

export async function updateProfileById(profileId: string, updates: Partial<SimpleProfileSchema>) {
    return await db.profile.update({
        where: { id: profileId },
        data: {
            ...updates,
            dateOfBirth: updates.dateOfBirth ? new Date(updates.dateOfBirth) : undefined,
        },
    });
}

export async function getProfileByUserId(userId: string) {
    return await db.user.findUnique({
        where: {
            id: userId
        }, select: {
            profile: {
                include: {
                    avatar: true,
                    banner: true,
                },
            },
        }
    });
}

export async function searchUsers(query: string, limit = 20) {
    return await db.user.findMany({
        where: {
            OR: [
                {
                    profile: {
                        username: { contains: query }
                    }
                },
                {
                    profile: {
                        fullName: { contains: query }
                    }
                },
            ],
        },
        take: limit,
        orderBy: {
            profile: {
                username: "asc"
            }
        },
    });
}

/**
 * Returns all the users (id, profile)
 */
export async function getAllUsers() {
    return await db.user.findMany({
        select: {
            id: true,
            profile: {
                include: {
                    avatar: true,
                    banner: true,
                },
            },
        },
    });
}

