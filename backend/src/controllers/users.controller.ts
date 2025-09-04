import { NextFunction, Request, Response } from "express";
import { TUserId, TUsername, TUserSchema, userIdSchema, usernameSchema } from "../types/zod";
import { findProfileById, findUserAndProfileById, findUserById, updateProfileUsernameById } from "../services/users.service";

const validateUserId = (res: Response, userId: string) => {
    const validationResult = userIdSchema.safeParse(userId);

    if (!validationResult.success) {
        res.status(400).json({
            message: 'Invalid user ID',
            errors: validationResult.error.errors
        });
        return;
    }

    return validationResult;
}

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId: TUserId = req.params.id;

        const validatedId = validateUserId(res, userId);
        if (!validatedId) return;

        const parsedUserId = validatedId.data;
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

export const modifyUsername = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const userId: TUserId = req.params.id;
        const usernameData: TUsername = req.body.username;

        console.log(userId)
        console.log(usernameData)

        const parsedUsername = usernameSchema.parse(usernameData);

        const validatedId = validateUserId(res, userId);
        if (!validatedId) return;

        const parsedUserId = validatedId.data;
        const user = await findUserById(parsedUserId);

        if (!user?.profileId) {
            res.status(404).json({ message: 'this user has no associated any profile' });
            return;
        }

        const profile = await findProfileById(user?.profileId);
        await updateProfileUsernameById(profile?.id!, parsedUsername);
        res.status(200).json({ message: 'ok' })

    } catch (err) {
        next(err);
    }
}