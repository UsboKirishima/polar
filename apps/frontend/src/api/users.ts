import api from '@/axiosApi'

/**
 * @deprecated Use tRPC API instead
 */
export const getAllUsers = () => api.get('/users/')

/**
 * @deprecated Use tRPC API instead
 */
export const getUserByUsername = (username: string) => api.get(`/users/u/${username}`)

/**
 * @deprecated Use tRPC API instead
 */
export const getUserById = (userId: string) => api.get(`/users/${userId}`)

/**
 * @deprecated Use tRPC API instead
 */
export const getAllFriendsByUserId = (userId: string) => api.get(`/users/${userId}/friends`)
