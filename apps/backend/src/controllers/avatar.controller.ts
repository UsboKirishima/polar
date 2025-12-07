import type { NextFunction, Request, Response } from 'express';

import { imageKit } from '@polar/media';
import { avatarService } from '@polar/services';

/**
 * @deprecated Use tRPC API instead
 */
export async function uploadAvatar(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const file = req.file;
        const userId = req.payload?.userId;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        if (!file) {
            res.status(400).json({ message: 'file is required' });
            return;
        }

        const uploadResult = await imageKit.upload({
            file: file.buffer,
            fileName: `user-${userId}.png`,
            folder: '/avatars',
        });

        const data = await avatarService.uploadAvatar(userId, uploadResult.url);
        res.status(200).json({ message: 'Avatar successfully uploaded', data });
    }
    catch (err) {
        next(err);
    }
}

/**
 * @deprecated Use tRPC API instead
 */
export async function getAvatarByUserId(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const userId: string = req.params.userId;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const data = await avatarService.getAvatarByUserId(userId);
        res.status(200).json(data);
    }
    catch (err) {
        next(err);
    }
}

/**
 * @deprecated Use tRPC API instead
 */
export async function getUserAvatar(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const userId: string = req.params.userId;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const data = await avatarService.getAvatarByUserId(userId);
        res.status(200).json(data);
    }
    catch (err) {
        next(err);
    }
}

/**
 * @deprecated Use tRPC API instead
 */
export async function deleteUserAvatar(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const userId: string = req.params.userId;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        await avatarService.deleteAvatar(userId);
        res.status(200).json({ message: `Avatar removed from user ${userId}` });
    }
    catch (err) {
        next(err);
    }
}
