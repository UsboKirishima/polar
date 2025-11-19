import api from '@/axiosApi'

// Get pending friend requests 
/**
 * @deprecated Use tRPC API instead
 */
export const getPendingFriendRequests = () => api.get('/friends/requests')

// Get all friends
/**
 * @deprecated Use tRPC API instead
 */
export const getFriends = () => api.get('/friends/')

// Send a friend request
/**
 * @deprecated Use tRPC API instead
 */
export const sendFriendRequest = (receiverId: string) =>
    api.post('/friends/request', { receiverId })

// Accept a friend request
/**
 * @deprecated Use tRPC API instead
 */
export const acceptFriendRequest = (senderId: string) => api.post('/friends/accept', { senderId })

// Deny a friend request
/**
 * @deprecated Use tRPC API instead
 */
export const denyFriendRequest = (senderId: string) => api.post('/friends/deny', { senderId })

// Remove a friend
/**
 * @deprecated Use tRPC API instead
 */
export const removeFriendship = (friendId: string) => api.post(`/friends/remove`, { friendId })
