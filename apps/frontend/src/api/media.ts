import api from '@/axiosApi'

/* ==== AVATAR ==== */
/**
 * @deprecated Use tRPC API instead
 */
export const getUserAvatar = () => api.get('/avatar')

/**
 * @deprecated Use tRPC API instead
 */
export const uploadUserAvatar = (file: FormData) => api.post('/avatar', file)

/**
 * @deprecated Use tRPC API instead
 */
export const deleteUserAvatar = () => api.delete('/avatar')

/**
 * @deprecated Use tRPC API instead
 */
export const getAvatarByUserId = (userId: string) => api.get(`/avatar/${userId}`)

/* ==== BANNER ==== */
/**
 * @deprecated Use tRPC API instead
 */
export const getUserBanner = () => api.get('/banner')

/**
 * @deprecated Use tRPC API instead
 */
export const uploadUserBanner = (file: FormData) => api.post('/banner', file)

/**
 * @deprecated Use tRPC API instead
 */
export const deleteUserBanner = () => api.delete('/banner')

/**
 * @deprecated Use tRPC API instead
 */
export const getBannerByUserId = (userId: string) => api.get(`/banner/${userId}`)
