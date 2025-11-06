import { db } from "@polar/db";
import { cacheManager } from "./cache";

const CACHE_TTL = 60; // Expiriation value (60 seconds)
const CACHE_KEYS = {
    pendingRequests: (receiverId: string) => `friend_requests:pending:${receiverId}`,
    sentRequests: (senderId: string) => `friend_requests:sent:${senderId}`,
    userFriends: (userId: string) => `freidns:${userId}`
}

/**
 * Creates a new friend requests
 * - Check if the request has been sent to itself.
 * - Check if there are no requests already pending.
 */
export async function createFriendRequest(senderId: string, receiverId: string) {
    if (senderId === receiverId) {
        throw new Error("You cannot send a request to yourself.");
    }

    const existingRequest = await db.friendRequest.findUnique({
        where: {
            senderId_receiverId: {
                senderId,
                receiverId,
            },
        },
    });

    if (existingRequest) {
        throw new Error("Request already sent to this user");
    }

    await cacheManager.delete(CACHE_KEYS.pendingRequests(receiverId))
    await cacheManager.delete(CACHE_KEYS.sentRequests(senderId));

    return await db.friendRequest.create({
        data: {
            senderId,
            receiverId,
        },
    });
}

export async function acceptFriendRequest(senderId: string, receiverId: string) {
    return await db.$transaction(async (tx: any) => {
        const request = await tx.friendRequest.findUnique({
            where: {
                senderId_receiverId: {
                    senderId,
                    receiverId,
                },
            },
        });

        if (!request || request.status !== "PENDING") {
            throw new Error("Request not found or already managed.");
        }

        await tx.friendRequest.update({
            where: {
                senderId_receiverId: {
                    senderId,
                    receiverId,
                },
            },
            data: { status: "ACCEPTED" },
        });

        await tx.friendship.createMany({
            data: [
                { userId: senderId, friendId: receiverId },
                { userId: receiverId, friendId: senderId },
            ],
        });

        /* Invalidate pending friend requests */
        await cacheManager.delete(CACHE_KEYS.pendingRequests(receiverId));

        /* Invalidate the friend list for both users */
        await cacheManager.delete(CACHE_KEYS.userFriends(senderId));
        await cacheManager.delete(CACHE_KEYS.userFriends(receiverId));
    });
}


export async function denyFriendRequest(senderId: string, receiverId: string) {
    const result = await db.friendRequest.update({
        where: {
            senderId_receiverId: {
                senderId,
                receiverId,
            },
        },
        data: { status: "REJECTED" },
    });

    await cacheManager.delete(CACHE_KEYS.pendingRequests(receiverId));
    await cacheManager.delete(CACHE_KEYS.sentRequests(senderId));

    return result;
}

export async function removeFriendship(userId: string, friendId: string) {

    await cacheManager.delete(CACHE_KEYS.userFriends(userId));
    await cacheManager.delete(CACHE_KEYS.userFriends(friendId));

    return await db.friendship.delete({
        where: {
            userId_friendId: {
                userId,
                friendId
            }
        }
    })
}

export async function __getAllPendingFriendRequests(userId: string) {
    return await db.friendRequest.findMany({
        where: {
            receiverId: userId,
            status: "PENDING",
        },
        include: {
            sender: {
                select: {
                    id: true,
                    email: true,
                    profile: {
                        include: {
                            avatar: true,
                            banner: true
                        }
                    },
                },
            },
        },
    });
}

export async function getAllPendingFriendRequests(userId: string) {
    const cacheKey = CACHE_KEYS.pendingRequests(userId);

    const cached =
        await cacheManager.get<ReturnType<typeof __getAllPendingFriendRequests>>(cacheKey);
    if (cached)
        return cached;

    const result = await __getAllPendingFriendRequests(userId);
    if (result) {
        cacheManager.set(cacheKey, result, {
            ttl: CACHE_TTL
        });
    }

    return result;
}

export async function __getAllFriendsByUserId(userId: string) {
    return await db.friendship.findMany({
        where: { userId },
        include: {
            friend: {
                select: {
                    id: true,
                    email: true,
                    profile: {
                        include: {
                            avatar: true,
                            banner: true
                        }
                    },
                },
            },
        },
    });
}

export async function getAllFriendsByUserId(userId: string) {
    const cacheKey = CACHE_KEYS.userFriends(userId);

    const cached =
        await cacheManager.get<ReturnType<typeof __getAllFriendsByUserId>>(cacheKey)
    if (cached) return cached;

    const result = await __getAllFriendsByUserId(userId);
    if (result) {
        cacheManager.set(cacheKey, result, {
            ttl: CACHE_TTL
        })
    }

    return result;
}

export async function __getAllSentRequests(userId: string) {
    return await db.user.findUnique({
        where: {
            id: userId
        },
        select: {
            sentFriendRequests: true
        }
    })
}

export async function getAllSentRequests(userId: string) {
    const cacheKey = CACHE_KEYS.sentRequests(userId);

    const cached =
        await cacheManager.get<ReturnType<typeof __getAllSentRequests>>(cacheKey);
    if (cached) return cached;

    const result = await __getAllSentRequests(userId);
    if (result) {
        cacheManager.set(cacheKey, result, {
            ttl: CACHE_TTL
        });
    }

    return result;
}