import bcrypt from 'bcrypt';
import { db } from '../utils/db';
import { profileSchema, TUserSchema } from '../types/zod';
import { SimpleProfileSchema, SimpleUserSchema } from '../types/general';
import { Profile, User } from '../generated/prisma';

export function findUserByEmail(email: string) {
    return db.user.findUnique({
        where: {
            email,
        },
    });
}

interface UserMailNPassword {
    email: string;
    password: string;
}

export function createUserByEmailAndPassword(user: UserMailNPassword) {
    user.password = bcrypt.hashSync(user.password, 12);
    return db.user.create({
        data: user,
    });
}


export function createUserWithProfile(user: SimpleUserSchema) {
    user.password = bcrypt.hashSync(user.password, 12);
    return db.user.create({
        data: user,
    });
}


export function createProfile(profile: SimpleProfileSchema) {
    return db.profile.create({
        data: {
            username: profile?.username,
            dateOfBirth: new Date(profile?.dateOfBirth ?? Date.now()),
            fullName: profile?.fullName,
        },
    })
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


export async function findUserAndProfileById(id: string) {
    const user = await findUserById(id);
    const profile = await findProfileById(user?.profileId!);
    
    if (!user || !profile) return;

    return {
        ...user,
        profile
    };
}

export function updateProfileUsernameById(profileId: string, newUsername: string) {
    return db.profile.update({
        where: {
            id: profileId
        },
        data: {
            username: newUsername
        }
    })
} 