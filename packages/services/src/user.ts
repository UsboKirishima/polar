import bcrypt from "bcrypt";
import type { SimpleProfileSchema, SimpleUserSchema } from "@polar/types/general.js";
import { db, User } from "@polar/db";
import { cacheManager } from "./cache";

export const CACHE_TTL = 60;
export const CACHE_KEY = {
    // USER/PROFILE KEYS
    userByEmail: (email: string) => `user:email:${email}`,
    userById: (id: string) => `user:id:${id}`,
    profileById: (id: string) => `profile:id:${id}`,
    userAndProfileById: (id: string) => `user_profile:id:${id}`,
    userAndProfileByUsername: (username: string) => `user_profile:username:${username}`,
    profileByUserId: (userId: string) => `profile:user_id:${userId}`,
    allUsersSimple: "users:all_simple", // for getAllUsers

    // FRIEND KEYS
    userFriends: (userId: string) => `user:friends:${userId}`,
}

/* Type definitions */
type UserFull = Awaited<ReturnType<typeof __findUserAndProfileById>>;
type UserSimple = Awaited<ReturnType<typeof __findUserById>>;
type ProfileSimple = Awaited<ReturnType<typeof __findProfileById>>;
type FriendsList = Awaited<ReturnType<typeof __findAllFriendsByUserId>>;
type ProfileByUserId = Awaited<ReturnType<typeof __getProfileByUserId>>;
type AllUsers = Awaited<ReturnType<typeof __getAllUsers>>;


// --- Reading functions (Database Only) ---

/**
 * Find user by email (Direct DB access)
 */
export async function __findUserByEmail(email: string) {
    return await db.user.findUnique({
        where: { email },
    });
}

/**
 * Find user by id (Direct DB access)
 */
export async function __findUserById(id: string) {
    return await db.user.findUnique({
        where: { id },
    });
}

/**
 * Find profile by id (Direct DB access)
 */
export async function __findProfileById(profileId: string) {
    return await db.profile.findUnique({
        where: { id: profileId },
    });
}

/**
 * Find user and profile by user id (Direct DB access)
 */
export async function __findUserAndProfileById(userId: string) {
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
        }
    })
}

/**
 * Find user and profile by username (Direct DB access)
 */
export async function __findUserAndProfileByUsername(username: string) {
    return await db.user.findFirst({
        where: {
            profile: { is: { username } },
        },
        include: {
            profile: { include: { avatar: true, banner: true } },
        },
    });
}

/**
 * Find all friends by user id (Direct DB access)
 */
export async function __findAllFriendsByUserId(userId: string) {
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
                                include: { avatar: true, banner: true },
                            },
                        },
                    },
                },
            },
        },
    });
}

/**
 * Get profile by user id (Direct DB access)
 */
export async function __getProfileByUserId(userId: string) {
    return await db.user.findUnique({
        where: { id: userId },
        select: {
            profile: {
                include: { avatar: true, banner: true },
            },
        }
    });
}

/**
 * Get all users (id, profile) (Direct DB access)
 */
export async function __getAllUsers() {
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

// --- Funzioni di Lettura (Caching) ---

export async function findUserByEmail(email: string) {
    const cacheKey = CACHE_KEY.userByEmail(email);
    const cached = await cacheManager.get<UserSimple>(cacheKey);
    if (cached) return cached;

    const user = await __findUserByEmail(email);
    if (user) await cacheManager.set(cacheKey, user, { ttl: CACHE_TTL });
    return user;
}

export async function findUserById(id: string) {
    const cacheKey = CACHE_KEY.userById(id);
    const cached = await cacheManager.get<UserSimple>(cacheKey);
    if (cached) return cached;

    const user = await __findUserById(id);
    if (user) await cacheManager.set(cacheKey, user, { ttl: CACHE_TTL });
    return user;
}

export async function findProfileById(profileId: string) {
    const cacheKey = CACHE_KEY.profileById(profileId);
    const cached = await cacheManager.get<ProfileSimple>(cacheKey);
    if (cached) return cached;

    const profile = await __findProfileById(profileId);
    if (profile) await cacheManager.set(cacheKey, profile, { ttl: CACHE_TTL });
    return profile;
}

export async function findUserAndProfileById(userId: string) {
    const cacheKey = CACHE_KEY.userAndProfileById(userId);
    const cached = await cacheManager.get<UserFull>(cacheKey);
    if (cached) return cached;

    const userProfile = await __findUserAndProfileById(userId);
    if (userProfile) await cacheManager.set(cacheKey, userProfile, { ttl: CACHE_TTL });
    return userProfile;
}

export async function findUserAndProfileByUsername(username: string) {
    const cacheKey = CACHE_KEY.userAndProfileByUsername(username);
    const cached = await cacheManager.get<UserFull>(cacheKey);
    if (cached) return cached;

    const userProfile = await __findUserAndProfileByUsername(username);
    if (userProfile) await cacheManager.set(cacheKey, userProfile, { ttl: CACHE_TTL });
    return userProfile;
}

export async function findAllFriendsByUserId(userId: string) {
    const cacheKey = CACHE_KEY.userFriends(userId);
    const cached = await cacheManager.get<FriendsList>(cacheKey);
    if (cached) return cached;

    const friends = await __findAllFriendsByUserId(userId);
    if (friends) await cacheManager.set(cacheKey, friends, { ttl: CACHE_TTL });
    return friends;
}

export async function getProfileByUserId(userId: string) {
    const cacheKey = CACHE_KEY.profileByUserId(userId);
    const cached = await cacheManager.get<ProfileByUserId>(cacheKey);
    if (cached) return cached;

    const profile = await __getProfileByUserId(userId);
    if (profile) await cacheManager.set(cacheKey, profile, { ttl: CACHE_TTL });
    return profile;
}

export async function getAllUsers() {
    const cacheKey = CACHE_KEY.allUsersSimple;
    const cached = await cacheManager.get<AllUsers>(cacheKey);
    if (cached) return cached;

    const users = await __getAllUsers();
    if (users) await cacheManager.set(cacheKey, users, { ttl: CACHE_TTL });
    return users;
}

export async function searchUsers(query: string, limit = 20) {
    return await db.user.findMany({
        where: {
            OR: [
                { profile: { username: { contains: query } } },
                { profile: { fullName: { contains: query } } },
            ],
        },
        take: limit,
        orderBy: { profile: { username: "asc" } },
    });
}

// --- Writing functions (Cache Invalidation) ---

type UserMailNPassword = {
    email: string;
    password: string;
};

export function createUserByEmailAndPassword(user: UserMailNPassword) {
    user.password = bcrypt.hashSync(user.password, 12);
    const createdUser = db.user.create({
        data: user,
    });

    cacheManager.delete(CACHE_KEY.userByEmail(user.email));
    cacheManager.delete(CACHE_KEY.allUsersSimple);

    return createdUser;
}

export async function createUserWithProfile(user: Omit<SimpleUserSchema, "profile.bio"> & { profile: Omit<SimpleProfileSchema, "bio"> }) {
    const hashedPassword = bcrypt.hashSync(user.password, 12);
    const createdUser = await db.user.create({
        data: {
            email: user.email,
            password: hashedPassword,
            profile: {
                create: {
                    username: user.profile.username,
                    dateOfBirth: new Date(user.profile.dateOfBirth),
                    fullName: user.profile.fullName,
                },
            },
        },
    });

    await cacheManager.delete(CACHE_KEY.userByEmail(user.email));
    await cacheManager.delete(CACHE_KEY.userAndProfileByUsername(user.profile.username));
    await cacheManager.delete(CACHE_KEY.allUsersSimple);

    return createdUser;
}

export async function createProfile(profile: SimpleProfileSchema, userId: string) {
    const profileData = await db.profile.create({
        data: {
            username: profile.username,
            dateOfBirth: new Date(profile.dateOfBirth),
            fullName: profile.fullName,
            bio: profile.bio ?? "unknown",
            userId,
        },
    });

    await cacheManager.delete(CACHE_KEY.userById(userId));
    await cacheManager.delete(CACHE_KEY.userAndProfileById(userId));
    await cacheManager.delete(CACHE_KEY.userAndProfileByUsername(profile.username));
    await cacheManager.delete(CACHE_KEY.profileByUserId(userId));
    await cacheManager.delete(CACHE_KEY.profileById(profileData.id));
    await cacheManager.delete(CACHE_KEY.allUsersSimple);

    return profileData;
}

export async function updateProfileById(profileId: string, updates: Partial<SimpleProfileSchema>) {
    const profile = await db.profile.findUnique({
        where: { id: profileId },
        select: { userId: true, username: true }
    });

    if (!profile) throw new Error("Profile not found.");

    const result = await db.profile.update({
        where: { id: profileId },
        data: {
            ...updates,
            dateOfBirth: updates.dateOfBirth ? new Date(updates.dateOfBirth) : undefined,
        },
    });

    const userId = profile.userId;

    await cacheManager.delete(CACHE_KEY.userById(userId));
    await cacheManager.delete(CACHE_KEY.userAndProfileById(userId));
    await cacheManager.delete(CACHE_KEY.profileByUserId(userId));
    await cacheManager.delete(CACHE_KEY.profileById(profileId));
    await cacheManager.delete(CACHE_KEY.allUsersSimple);

    if (updates.username) {
        await cacheManager.delete(CACHE_KEY.userAndProfileByUsername(profile.username)); // Old
        await cacheManager.delete(CACHE_KEY.userAndProfileByUsername(updates.username)); // New
    } else {
        await cacheManager.delete(CACHE_KEY.userAndProfileByUsername(profile.username));
    }


    return result;
}
