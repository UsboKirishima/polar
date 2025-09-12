import bcrypt from "bcrypt";

import type { SimpleProfileSchema, SimpleUserSchema } from "../types/general.js";

import { Profile, User } from "../generated/prisma.js";
import { profileSchema, TUserSchema } from "../types/zod.js";
import { db } from "../utils/db.js";

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

export function createUserWithProfile(user: Omit<SimpleUserSchema, "profile.bio"> & { profile: Omit<SimpleProfileSchema, "bio"> }) {
    const hashedPassword = bcrypt.hashSync(user.password, 12);
    return db.user.create({
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

export function createProfile(profile: SimpleProfileSchema, userId: string) {
    return db.profile.create({
        data: {
            username: profile.username,
            dateOfBirth: new Date(profile.dateOfBirth),
            fullName: profile.fullName,
            bio: profile.bio ?? "unknown",
            userId,
        },
    });
}

export function findUserById(id: string) {
    return db.user.findUnique({
        where: {
            id,
        },
    });
}

export function findProfileById(profileId: string) {
    return db.profile.findUnique({
        where: {
            id: profileId,
        },
    });
}

export function findUserAndProfileById(userId: string) {
    return db.user.findUnique({
        where: { id: userId },
        include: { likes: true, profile: true },
    });
}

export function findUserAndProfileByUsername(username: string) {
    return db.user.findFirst({
        where: {
            profile: {
                is: {
                    username,
                },
            },
        },
        include: {
            profile: true,
        },
    });
}

export function findAllFriendsByUsedId(userId: string) {
    return db.user.findUnique({
        where: {
            id: userId,
        },
        include: {
            friends: {
                include: {
                    friend: {
                        include: {
                                password: false,
                                profile: true
                        }
                    },
                    user: {
                        include: {
                                password: false,
                            profile: true
                        }
                    },
                }
            },
        },
    });
}

export function updateProfileById(profileId: string, updates: Partial<SimpleProfileSchema>) {
    return db.profile.update({
        where: { id: profileId },
        data: {
            ...updates,
            dateOfBirth: updates.dateOfBirth ? new Date(updates.dateOfBirth) : undefined,
        },
    });
}

/**
 * Returns all the users (id, profile)
 */
export function getAllUsers() {
    return db.user.findMany({
        select: {
            id: true,
            profile: true,
        },
    });
}

