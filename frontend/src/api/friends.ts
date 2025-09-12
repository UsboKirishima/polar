import api from "@/axiosApi";

// Get pending friend requests
export const getPendingFriendRequests = () => api.get("/friends/requests");

// Get all friends
export const getFriends = () => api.get("/friends/");

// Send a friend request
export const sendFriendRequest = (receiverId: string) =>
    api.post("/friends/request", { receiverId });

// Accept a friend request
export const acceptFriendRequest = (senderId: string) =>
    api.post("/friends/accept", { senderId });

// Deny a friend request
export const denyFriendRequest = (senderId: string) =>
    api.post("/friends/deny", { senderId });

// Remove a friend
export const removeFriendship = (friendId: string) =>
    api.post(`/friends/remove`, { friendId })