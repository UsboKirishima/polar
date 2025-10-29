import type { TUserId, TUsername } from '@polar/types/zod.js';
import type { NextFunction, Request, Response } from 'express';

import { userService } from '@polar/services';
import { userIdSchema, usernameSchema } from '@polar/types/zod.js';

function validateUserId(res: Response, userId: string) {
    const validationResult = userIdSchema.safeParse(userId);
    if (!validationResult.success) {
        res.status(400).json({
            message: 'Invalid user ID',
            errors: validationResult.error.errors,
        });
        return;
    }
    return validationResult.data;
}

// -------------------- GET USER BY ID --------------------
export async function getUserById(req: Request, res: Response, next: NextFunction) {
    try {
        const userId: TUserId = req.params.id;
        const parsedUserId = validateUserId(res, userId);
        if (!parsedUserId)
            return;

        const userAndProfile = await userService.findUserAndProfileById(parsedUserId);
        if (!userAndProfile) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const { password, ...userWithoutPassword } = userAndProfile;
        res.json(userWithoutPassword);
    }
    catch (err) {
        next(err);
    }
}

// -------------------- GET USER BY USERNAME --------------------
export async function getUserByUsername(req: Request, res: Response, next: NextFunction) {
    try {
        const username: TUsername = req.params.username;

        if (!username) {
            res.status(400).json({ error: 'username is required' });
            return;
        }

        const userAndProfile = await userService.findUserAndProfileByUsername(username);
        if (!userAndProfile) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const { password, ...userWithoutPassword } = userAndProfile;
        res.json(userWithoutPassword);
    }
    catch (err) {
        next(err);
    }
}

// -------------------- MODIFY USERNAME --------------------
export async function modifyUsername(req: Request, res: Response, next: NextFunction) {
    try {
        const userId: TUserId = req.params.id;
        const usernameData: TUsername = req.body.username;

        const parsedUsername = usernameSchema.parse(usernameData);
        const parsedUserId = validateUserId(res, userId);
        if (!parsedUserId)
            return;

        const user = await userService.findUserAndProfileById(parsedUserId);
        if (!user?.profile) {
            res.status(404).json({ message: 'This user has no associated profile' });
            return;
        }

        await userService.updateProfileById(user.profile.id, { username: parsedUsername });
        res.status(200).json({ message: 'Username updated successfully' });
    }
    catch (err) {
        next(err);
    }
}

// -------------------- GET ALL FRIENDS -------------------
export async function getAllFriends(req: Request, res: Response, next: NextFunction) {
    try {
        const userId: TUserId = req.params.id;
        const user = await userService.findAllFriendsByUserId(userId);

        if (!user) {
            res.status(404).json({ message: 'user not found' });
            return;
        }

        const friendsOnly = user.friends;
        res.status(200).json(friendsOnly);
    }
    catch (err) {
        next(err);
    }
}

// -------------------- GET ALL USERS --------------------
export async function getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json(users);
    }
    catch (err) {
        next(err);
    }
}
