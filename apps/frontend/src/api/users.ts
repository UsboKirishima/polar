import api from "@/axiosApi";

export const getAllUsers = () => api.get('/users/');
export const getUserByUsername = (username: string) => api.get(`/users/u/${username}`);
export const getUserById = (userId: string) => api.get(`/users/${userId}`);
export const getAllFriendsByUserId = (userId: string) => api.get(`/users/${userId}/friends`);