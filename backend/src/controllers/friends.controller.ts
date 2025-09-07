import { Request, Response, NextFunction } from "express";
import * as friendService from "../services/friends.service";

/**
 * Create a new friend request
 * Body: { receiverId: string }
 */
export const createFriendRequest = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const senderId = req.payload?.userId;
        const { receiverId } = req.body;

        if (!senderId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        if (!receiverId) {
            res.status(400).json({ error: "receiverId is required" });
            return;
        }

        const request = await friendService.createFriendRequest(senderId, receiverId);
        res.status(201).json({ message: "Friend request sent successfully", request });
        return;
    } catch (err) {
        next(err);
    }
};

/**
 * Accept a pending friend request
 * Body: { senderId: string }
 */
export const acceptFriendRequest = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const receiverId = req.payload?.userId;
        const { senderId } = req.body;

        if (!receiverId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        if (!senderId) {
            res.status(400).json({ error: "senderId is required" });
            return;
        }

        await friendService.acceptFriendRequest(senderId, receiverId);
        res.status(200).json({ message: "Friend request accepted and friendship created" });
        return;
    } catch (err) {
        next(err);
    }
};

/**
 * Reject a pending friend request
 * Body: { senderId: string }
 */
export const denyFriendRequest = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const receiverId = req.payload?.userId;
        const { senderId } = req.body;

        if (!receiverId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        if (!senderId) {
            res.status(400).json({ error: "senderId is required" });
            return;
        }

        await friendService.denyFriendRequest(senderId, receiverId);
        res.status(200).json({ message: "Friend request rejected" });
        return;
    } catch (err) {
        next(err);
    }
};

/**
 * Get all pending friend requests received by the logged-in user
 */
export const getAllPendingFriendRequests = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.payload?.userId;

        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const requests = await friendService.getAllPendingFriendRequests(userId);
        res.status(200).json({ requests });
        return;
    } catch (err) {
        next(err);
    }
};

/**
 * Get all friends of the logged-in user
 */
export const getAllFriendsByUserId = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.payload?.userId;

        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const friends = await friendService.getAllFriendsByUserId(userId);
        res.status(200).json({ friends });
        return;
    } catch (err) {
        next(err);
    }
};
