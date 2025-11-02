import type { NextFunction, Request, Response } from 'express'

import * as media from '@polar/media'
import * as services from '@polar/services'

export async function uploadAvatar(
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
            folder: '/avatars',
        })

        const data = await services.avatarService.uploadAvatar(
            userId,
            uploadResult.url
        )
        res.status(200).json({ message: 'Avatar successfully uploaded', data })
    } catch (err) {
        next(err)
    }
}

export async function getAvatarByUserId(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const userId = req.params.userId
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' })
        }

        const data = await services.avatarService.getAvatarByUserId(userId)
        res.status(200).json(data)
    } catch (err) {
        next(err)
        return
    }
}

export async function getUserAvatar(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const userId = req.params.userId
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' })
        }

        const data = await services.avatarService.getAvatarByUserId(userId)
        res.status(200).json(data)
    } catch (err) {
        next(err)
        return
    }
}

export async function deleteUserAvatar(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const userId = req.params.userId
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' })
        }

        await services.avatarService.deleteAvatar(userId)
        res.status(200).json({ message: `Avatar removed from user ${userId}` })
    } catch (err) {
        next(err)
        return
    }
}
