import api from "@/axiosApi";

export const getAllUsers = () => api.get('/users/');
export const getUserByUsername = (username: string) => api.get(`/users/u/${username}`);