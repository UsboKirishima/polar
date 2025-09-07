import api from "@/axiosApi";

export const getAllUsers = () => api.get('/users/');