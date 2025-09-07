export interface FriendRequest {
    id: number;
    senderId: string;
    receiverId: string;
    status: "PENDING" | "ACCEPTED" | "REJECTED";
    createdAt: string;
    updatedAt: string;
    sender: {
        id: string;
        email: string;
        profile?: {
            username: string;
            fullName: string;
        };
    };
}

export interface Friendship {
    id: string;
    userId: string;
    friendId: string;
    createdAt: string;
    friend: {
        id: string;
        email: string;
        profile?: {
            username: string;
            fullName: string;
        };
    };
}
