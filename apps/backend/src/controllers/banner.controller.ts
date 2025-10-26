import { NextFunction, Request, Response } from 'express';
import { bannerService } from '@polar/services';
import { imageKit } from '@polar/media';

export async function uploadBanner(req: Request, res: Response, next: NextFunction) {
    try {
        const file = req.file;
        const userId = req.payload?.userId;

        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        if (!file) {
            res.status(400).json({ message: 'file is required' });
            return;
        }

        const uploadResult = await imageKit.upload({
            file: file.buffer,
            fileName: `user-${userId}.png`,
            folder: '/banners'
        });

        const data = await bannerService.uploadBanner(userId, uploadResult.url);
        res.status(200).json({ message: 'Banner successfully uploaded', data });
    } catch (err) {
        next(err);
    }
}

export async function getBannerByUserId(req: Request, res: Response, next: NextFunction) {
    try {
        const userId: string = req.params.userId;

        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const data = await bannerService.getBannerByUserId(userId);
        res.status(200).json(data);
    } catch (err) {
        next(err);
    }
}

export async function getUserBanner(req: Request, res: Response, next: NextFunction) {
    try {
        const userId: string = req.params.userId;

        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const data = await bannerService.getBannerByUserId(userId);
        res.status(200).json(data);
    } catch (err) {
        next(err);
    }
}

export async function deleteUserBanner(req: Request, res: Response, next: NextFunction) {
    try {
        const userId: string = req.params.userId;

        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        await bannerService.deleteBanner(userId);
        res.status(200).json({ message: 'Banner removed from user ' + userId });
    } catch (err) {
        next(err);
    }
}