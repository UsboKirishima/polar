import bcrypt from 'bcrypt';
import { db } from '../utils/db';

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

export function findUserById(id: string) {
    return db.user.findUnique({
        where: {
            id,
        },
    });
}