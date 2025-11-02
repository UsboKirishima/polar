import type { NextFunction, Request, Response } from 'express'

import * as media from '@polar/media'
import * as services from '@polar/services'

export async function uploadBanner(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const file = req.file
        const userId = req.payload?.userId

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' })
            return
        }

        if (!file) {
            res.status(400).json({ message: 'file is required' })
            return
        }

        const uploadResult = await media.imageKit.upload({
            file: file.buffer,
            fileName: `user-${userId}.png`,
            folder: '/banners',
        })

        const data = await services.bannerService.uploadBanner(
            userId,
            uploadResult.url
        )
        res.status(200).json({ message: 'Banner successfully uploaded', data })
    } catch (err) {
        next(err)
    }
}

export async function getBannerByUserId(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const userId = req.params.userId
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' })
        }

        const data = await services.bannerService.getBannerByUserId(userId)
        res.status(200).json(data)
    } catch (err) {
        next(err)
        return
    }
}

export async function getUserBanner(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const userId = req.params.userId
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' })
        }

        const data = await services.bannerService.getBannerByUserId(userId)
        res.status(200).json(data)
    } catch (err) {
        next(err)
        return
    }
}

export async function deleteUserBanner(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const userId = req.params.userId
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' })
        }

        await services.bannerService.deleteBanner(userId)
        res.status(200).json({ message: `Banner removed from user ${userId}` })
    } catch (err) {
        next(err)
        return
    }
}
