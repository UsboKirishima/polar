import api from '@/axiosApi'

/**
 * @deprecated Use tRPC API instead
 */
export const getAllPosts = () => api.get('/posts')

/**
 * @deprecated Use tRPC API instead
 */
export const getPostById = (postId: string) => api.get(`/posts/${postId}`)

/**
 * @deprecated Use tRPC API instead
 */
export const getAllPostsByUserId = (userId: string) => api.get(`/posts/user/${userId}`)

/**
 * @deprecated Use tRPC API instead
 */
export const toggleLike = (postId: string) => api.post(`/posts/${postId}/like`)

/**
 * @deprecated Use tRPC API instead
 */
export const createPost = (text: string, categories: { name: string }[]) =>
    api.post('/posts/new', { text, categories })

/**
 * @deprecated Use tRPC API instead
 */
export const deletePost = (postId: string) => api.delete(`/posts/${postId}`)

/**
 * @deprecated Use tRPC API instead
 */
export const addComment = (postid: string, text: string) =>
    api.post(`/posts/${postid}/comment`, { text })

/**
 * @deprecated Use tRPC API instead
 */
export const removeComment = (postId: string) => api.delete(`/posts/${postId}`)
