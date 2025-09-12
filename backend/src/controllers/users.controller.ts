import { NextFunction, Request, Response } from "express";
import { TUserId, TUsername, userIdSchema, usernameSchema } from "../types/zod";
import {
    findUserAndProfileById,
    updateProfileById,
    getAllUsers as getAllUsersDB,
    findUserAndProfileByUsername,
    findAllFriendsByUsedId
} from "../services/users.service";

const validateUserId = (res: Response, userId: string) => {
    const validationResult = userIdSchema.safeParse(userId);
    if (!validationResult.success) {
        res.status(400).json({
            message: 'Invalid user ID',
            errors: validationResult.error.errors
        });
        return;
    }
    return validationResult.data;
}

// -------------------- GET USER BY ID --------------------
export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId: TUserId = req.params.id;
        const parsedUserId = validateUserId(res, userId);
        if (!parsedUserId) return;

        const userAndProfile = await findUserAndProfileById(parsedUserId);
        if (!userAndProfile) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const { password, ...userWithoutPassword } = userAndProfile;
        res.json(userWithoutPassword);
    } catch (err) {
        next(err);
    }
}

// -------------------- GET USER BY USERNAME --------------------
export const getUserByUsername = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const username: TUsername = req.params.username;

        if (!username) {
            res.status(400).json({ error: "username is required" });
            return;
        }

        const userAndProfile = await findUserAndProfileByUsername(username);
        if (!userAndProfile) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const { password, ...userWithoutPassword } = userAndProfile;
        res.json(userWithoutPassword);
    } catch (err) {
        next(err);
    }
}

// -------------------- MODIFY USERNAME --------------------
export const modifyUsername = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId: TUserId = req.params.id;
        const usernameData: TUsername = req.body.username;

        const parsedUsername = usernameSchema.parse(usernameData);
        const parsedUserId = validateUserId(res, userId);
        if (!parsedUserId) return;

        const user = await findUserAndProfileById(parsedUserId);
        if (!user?.profile) {
            res.status(404).json({ message: 'This user has no associated profile' });
            return;
        }

        await updateProfileById(user.profile.id, { username: parsedUsername });
        res.status(200).json({ message: 'Username updated successfully' });
    } catch (err) {
        next(err);
    }
}

// -------------------- GET ALL FRIENDS -------------------
export const getAllFriends = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId: TUserId = req.params.id;
        const user = await findAllFriendsByUsedId(userId);

        if (!user) {
            res.status(404).json({ message: 'user not found' });
            return;
        }
        
        const friendsOnly = user.friends;
        res.status(200).json(friendsOnly);
    } catch (err) {
        next(err);
    }
}

// -------------------- GET ALL USERS --------------------
export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await getAllUsersDB();
        res.status(200).json(users);
    } catch (err) {
        next(err);
    }
}
