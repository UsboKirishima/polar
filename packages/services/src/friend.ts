import { db } from "@polar/db";

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
    });
}


export async function denyFriendRequest(senderId: string, receiverId: string) {
    return await db.friendRequest.update({
        where: {
            senderId_receiverId: {
                senderId,
                receiverId,
            },
        },
        data: { status: "REJECTED" },
    });
}

export async function removeFriendship(userId: string, friendId: string) {
    return db.friendship.delete({
        where: {
            userId_friendId: {
                userId,
                friendId
            }
        }
    })
}

export async function getAllPendingFriendRequests(userId: string) {
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

export async function getAllFriendsByUserId(userId: string) {
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

export async function getAllSentRequests(userId: string) {
    return await db.user.findUnique({
        where: {
            id: userId
        },
        select: {
            sentFriendRequests: true
        }
    })
}