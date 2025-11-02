import type { NextFunction, Request, Response } from 'express'

import * as services from '@polar/services'

/**
 * Create a new friend request
 * Body: { receiverId: string }
 */
export async function createFriendRequest(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const senderId = req.payload?.userId
        const { receiverId } = req.body

        if (!senderId) {
            res.status(401).json({ error: 'Unauthorized' })
            return
        }

        if (!receiverId) {
            res.status(400).json({ error: 'receiverId is required' })
            return
        }

        const data = await services.friendService.createFriendRequest(
            senderId,
            receiverId
        )
        res.status(201).json({
            message: 'Friend request sent successfully',
            request: data,
        })
    } catch (err) {
        next(err)
    }
}

/**
 * Accept a pending friend request
 * Body: { senderId: string }
 */
export async function acceptFriendRequest(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const receiverId = req.payload?.userId
        const { senderId } = req.body

        if (!receiverId) {
            res.status(401).json({ error: 'Unauthorized' })
            return
        }

        if (!senderId) {
            res.status(400).json({ error: 'senderId is required' })
            return
        }

        await services.friendService.acceptFriendRequest(senderId, receiverId)
        res.status(200).json({
            message: 'Friend request accepted and friendship created',
        })
    } catch (err) {
        next(err)
    }
}

/**
 * Reject a pending friend request
 * Body: { senderId: string }
 */
export async function denyFriendRequest(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const receiverId = req.payload?.userId
        const { senderId } = req.body

        if (!receiverId) {
            res.status(401).json({ error: 'Unauthorized' })
            return
        }

        if (!senderId) {
            res.status(400).json({ error: 'senderId is required' })
            return
        }

        const data = await services.friendService.denyFriendRequest(
            senderId,
            receiverId
        )
        res.status(200).json({ message: 'Friend request rejected' })
    } catch (err) {
        next(err)
    }
}

/**
 * Remove friend
 */
export async function removeFriendship(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const userId = req.payload?.userId
        const friendId = req.body.friendId

        if (!userId || !friendId) {
            res.status(400).json({
                message: 'Failed to find user or friend id',
            })
            return
        }

        const data = await services.friendService.removeFriendship(
            userId,
            friendId
        )
        res.status(200).json({ message: 'Friend has been removed.' })
    } catch (err) {
        next(err)
    }
}

/**
 * Get all pending friend requests received by the logged-in user
 */
export async function getAllPendingFriendRequests(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const userId = req.payload?.userId

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' })
            return
        }

        const data =
            await services.friendService.getAllPendingFriendRequests(userId)
        res.status(200).json({ requests: data })
    } catch (err) {
        next(err)
    }
}

/**
 * Get all friends of the logged-in user
 */
export async function getAllFriendsByUserId(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const userId = req.payload?.userId

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' })
            return
        }

        const data = await services.friendService.getAllFriendsByUserId(userId)
        res.status(200).json({ friends: data })
    } catch (err) {
        next(err)
    }
}
