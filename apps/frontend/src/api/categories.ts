import api from "@/axiosApi";

export const getAllCategories =
    () => api.get('/categories');

export const getCategoryById =
    (categoryId: number) => api.get(`/categories/${categoryId}`);

export const getCategoryByName =
    (categoryName: string) => api.get(`/categories/n/${categoryName}`);