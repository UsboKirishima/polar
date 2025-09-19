import api from '@/axiosApi';

/* ==== AVATAR ==== */
export const getUserAvatar = () => api.get('/avatar');

export const uploadUserAvatar = (file: FormData) =>
    api.post('/avatar', file);

export const deleteUserAvatar = () => api.delete('/avatar');

export const getAvatarByUserId = (userId: string) =>
    api.get(`/avatar/${userId}`);

/* ==== BANNER ==== */
export const getUserBanner = () => api.get('/banner');

export const uploadUserBanner = (file: FormData) =>
    api.post('/banner', file);

export const deleteUserBanner = () => api.delete('/banner');

export const getBannerByUserId = (userId: string) =>
    api.get(`/banner/${userId}`);
