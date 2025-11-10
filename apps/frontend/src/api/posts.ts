import api from '@/axiosApi'

export const getAllPosts = () => api.get('/posts')

export const getPostById = (postId: string) => api.get(`/posts/${postId}`)

export const getAllPostsByUserId = (userId: string) => api.get(`/posts/user/${userId}`)

export const toggleLike = (postId: string) => api.post(`/posts/${postId}/like`)

export const createPost = (text: string, categories: { name: string }[]) =>
    api.post('/posts/new', { text, categories })

export const deletePost = (postId: string) => api.delete(`/posts/${postId}`)

export const addComment = (postid: string, text: string) =>
    api.post(`/posts/${postid}/comment`, { text })

export const removeComment = (postId: string) => api.delete(`/posts/${postId}`)
