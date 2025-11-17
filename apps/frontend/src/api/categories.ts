import api from '@/axiosApi'

/**
 * @deprecated Use tRPC API instead
 */
export const getAllCategories = () => api.get('/categories')

/**
 * @deprecated Use tRPC API instead
 */
export const getCategoryById = (categoryId: number) => api.get(`/categories/${categoryId}`)

/**
 * @deprecated Use tRPC API instead
 */
export const getCategoryByName = (categoryName: string) => api.get(`/categories/n/${categoryName}`)
