import type { NextFunction, Request, Response } from 'express'

import { friendService } from '@polar/services'

/**
 * Create a new friend request
 * Body: { receiverId: string }
 * @deprecated Use tRPC API instead
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

        const request = await friendService.createFriendRequest(
            senderId,
            receiverId
        )
        res.status(201).json({
            message: 'Friend request sent successfully',
            request,
        })
    } catch (err) {
        next(err)
    }
}

/**
 * Accept a pending friend request
 * Body: { senderId: string }
 * @deprecated Use tRPC API instead
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

        await friendService.acceptFriendRequest(senderId, receiverId)
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
 * @deprecated Use tRPC API instead
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

        await friendService.denyFriendRequest(senderId, receiverId)
        res.status(200).json({ message: 'Friend request rejected' })
    } catch (err) {
        next(err)
    }
}

/**
 * Remove friend
 * @deprecated Use tRPC API instead
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

        await friendService.removeFriendship(userId, friendId)
        res.status(200).json({ message: 'Friend has been removed.' })
    } catch (err) {
        next(err)
    }
}

/**
 * Get all pending friend requests received by the logged-in user
 * @deprecated Use tRPC API instead
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

        const requests = await friendService.getAllPendingFriendRequests(userId)
        res.status(200).json({ requests })
    } catch (err) {
        next(err)
    }
}

/**
 * Get all friends of the logged-in user
 * @deprecated Use tRPC API instead
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

        const friends = await friendService.getAllFriendsByUserId(userId)
        res.status(200).json({ friends })
    } catch (err) {
        next(err)
    }
}
