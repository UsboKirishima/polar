import { defineStore } from "pinia";
import type { Category, Post } from "@/types";
import {
    getAllPosts,
    getPostById,
    getAllPostsByUserId,
    toggleLike,
    createPost,
    deletePost,
    addComment,
    removeComment
} from "@/api/posts";
import { getAllCategories, getCategoryById, getCategoryByName } from "@/api/categories";

export const usePostStore = defineStore("post", {
    state: () => ({
        posts: [] as Post[],
        myPosts: [] as Post[],
        categories: [] as Category[],
        loading: false,
        error: null as string | null
    }),
    actions: {
        async fetchAllPosts() {
            this.loading = true;
            this.error = null;
            try {
                const response = await getAllPosts();
                this.posts = response.data;
            } catch (err: any) {
                this.error = err.response?.data?.message || "Failed to fetch all posts";
            } finally {
                this.loading = false;
            }
        },

        async fetchPostById(postId: string) {
            this.loading = true;
            this.error = null;
            try {
                const response = await getPostById(postId);
                return response.data;
            } catch (err: any) {
                this.error = err.response?.data?.message || "Failed to fetch post";
            } finally {
                this.loading = false;
            }
        },

        async fetchAllPostsByUser(userId: string) {
            this.loading = true;
            this.error = null;
            try {
                const response = await getAllPostsByUserId(userId);
                this.myPosts = response.data;
                return response.data;
            } catch (err: any) {
                this.error = err.response?.data?.message || "Failed to fetch user's posts";
            } finally {
                this.loading = false;
            }
        },

        async createNewPost(text: string, categories: { name: string }[]) {
            this.loading = true;
            this.error = null;
            try {
                const response = await createPost(text, categories);
                this.posts.unshift(response.data.post); // aggiungi il nuovo post in cima
            } catch (err: any) {
                this.error = err.response?.data?.message || "Failed to create post";
            } finally {
                this.loading = false;
            }
        },

        async deletePost(postId: string) {
            this.loading = true;
            this.error = null;
            try {
                await deletePost(postId);
                this.posts = this.posts.filter(p => p.id !== postId);
                this.myPosts = this.myPosts.filter(p => p.id !== postId);
            } catch (err: any) {
                this.error = err.response?.data?.message || "Failed to delete post";
            } finally {
                this.loading = false;
            }
        },

        async togglePostLike(postId: string) {
            this.loading = true;
            this.error = null;
            try {
                const response = await toggleLike(postId);

                const refreshedPost = await this.fetchPostById(postId);
                // refresh likes
                const index = this.posts.findIndex(p => p.id === postId);
                if (index !== -1) {
                    this.posts[index] = refreshedPost;
                }
            } catch (err: any) {
                this.error = err.response?.data?.message || "Failed to toggle like";
            } finally {
                this.loading = false;
            }
        },

        async addPostComment(postId: string, text: string) {
            this.loading = true;
            this.error = null;
            try {
                const response = await addComment(postId, text);
                const index = this.posts.findIndex(p => p.id === postId);
                if (index !== -1) {
                    this.posts[index].comments.push(response.data.comment);
                }
            } catch (err: any) {
                this.error = err.response?.data?.message || "Failed to add comment";
            } finally {
                this.loading = false;
            }
        },

        async removePostComment(postId: string, commentId: string) {
            this.loading = true;
            this.error = null;
            try {
                await removeComment(commentId);
                const postIndex = this.posts.findIndex(p => p.id === postId);
                if (postIndex !== -1) {
                    this.posts[postIndex].comments = this.posts[postIndex].comments.filter(c => c.id !== commentId);
                }
            } catch (err: any) {
                this.error = err.response?.data?.message || "Failed to remove comment";
            } finally {
                this.loading = false;
            }
        },

        /**
         * ================= Categories =================
         */
        async fetchAllCategories() {
            this.loading = true;
            this.error = null;
            try {
                const categories = await getAllCategories();
                this.categories = categories.data;
                return categories.data;
            } catch (err: any) {
                this.error = err.response?.data?.message || 'Failed to fetch categories';
            } finally {
                this.loading = false;
            }
        },

        async getCategoryById(categoryId: number) {
            this.loading = true;
            this.error = null;
            try {
                const categoryResponse = await getCategoryById(categoryId);
                return categoryResponse.data as Category;
            } catch (err: any) {
                this.error = err.response?.data?.message || `Failed to fetch category ${categoryId}`;
            } finally {
                this.loading = false;
            }
        },

        async getCategoryByName(categoryName: string) {
            this.loading = true;
            this.error = null;
            try {
                const categoryResponse = await getCategoryByName(categoryName);
                return categoryResponse.data as Category;
            } catch (err: any) {
                this.error = err.response?.data?.message || `Failed to fetch category ${categoryName}`;
            } finally {
                this.loading = false;
            }
        },
    }
});
