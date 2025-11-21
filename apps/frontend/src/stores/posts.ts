import { defineStore } from 'pinia'
import * as postService from '@/interface/post-interface'
import * as categoryService from '@/interface/category-interface'
import type { Post, Category } from '@/types/trpc'

export const usePostStore = defineStore('post', {
    state: () => ({
        posts: [] as Post[],
        myPosts: [] as Post[],
        categories: [] as Category[],
        loading: false,
        error: null as string | null,
    }),
    actions: {
        async fetchAllPosts() {
            this.loading = true
            this.error = null
            try {
                const response = await postService.getAll()
                this.posts = response
            } catch (err: any) {
                this.error = err.message || 'Failed to fetch all posts'
            } finally {
                this.loading = false
            }
        },

        async fetchPostById(postId: string) {
            this.loading = true
            this.error = null
            try {
                const response = await postService.getById(postId)
                return response
            } catch (err: any) {
                this.error = err.message || 'Failed to fetch post'
            } finally {
                this.loading = false
            }
        },

        async fetchAllPostsByUser(userId: string) {
            this.loading = true
            this.error = null
            try {
                const response = await postService.getByUser(userId)
                this.myPosts = response
                return response
            } catch (err: any) {
                this.error = err.message || "Failed to fetch user's posts"
            } finally {
                this.loading = false
            }
        },

        async createNewPost(text: string, categories: { name: string }[], color: string) {
            this.loading = true
            this.error = null
            try {
                const response = await postService.create({ text, categories, color })
                this.posts.unshift(response) // aggiungi il nuovo post in cima
            } catch (err: any) {
                this.error = err.message || 'Failed to create post'
            } finally {
                this.loading = false
            }
        },

        async deletePost(postId: string) {
            this.loading = true
            this.error = null
            try {
                await postService.deleteById(postId)
                this.posts = this.posts.filter((p) => p.id !== postId)
                this.myPosts = this.myPosts.filter((p) => p.id !== postId)
            } catch (err: any) {
                this.error = err.message || 'Failed to delete post'
            } finally {
                this.loading = false
            }
        },

        async togglePostLike(postId: string) {
            this.loading = true
            this.error = null
            try {
                await postService.toggleLike(postId)

                const refreshedPost = await this.fetchPostById(postId)
                if (!refreshedPost) return
                // refresh likes
                const index = this.posts.findIndex((p) => p.id === postId)
                if (index !== -1) {
                    this.posts[index] = refreshedPost
                }
            } catch (err: any) {
                this.error = err.message || 'Failed to toggle like'
            } finally {
                this.loading = false
            }
        },

        async addPostComment(postId: string, text: string) {
            this.loading = true
            this.error = null
            try {
                await postService.addComment({ postId, text })
                const index = this.posts.findIndex((p) => p.id === postId)
                if (index !== -1) {
                    const refreshedPost = await this.fetchPostById(postId)
                    if (refreshedPost) this.posts[index] = refreshedPost
                }
            } catch (err: any) {
                this.error = err.message || 'Failed to add comment'
            } finally {
                this.loading = false
            }
        },

        async removePostComment(postId: string, commentId: string) {
            this.loading = true
            this.error = null
            try {
                await postService.removeComment(commentId)
                const postIndex = this.posts.findIndex((p) => p.id === postId)
                if (postIndex !== -1) {
                    const refreshedPost = await this.fetchPostById(postId)
                    if (refreshedPost) this.posts[postIndex] = refreshedPost
                }
            } catch (err: any) {
                this.error = err.message || 'Failed to remove comment'
            } finally {
                this.loading = false
            }
        },

        /**
         * ================= Categories =================
         */
        async fetchAllCategories() {
            this.loading = true
            this.error = null
            try {
                const categories = await categoryService.getAll()
                this.categories = categories
                return categories
            } catch (err: any) {
                this.error = err.message || 'Failed to fetch categories'
            } finally {
                this.loading = false
            }
        },

        async getCategoryById(categoryId: number) {
            this.loading = true
            this.error = null
            try {
                const categoryResponse = await categoryService.getById(categoryId)
                return categoryResponse as Category
            } catch (err: any) {
                this.error = err.message || `Failed to fetch category ${categoryId}`
            } finally {
                this.loading = false
            }
        },

        async getCategoryByName(categoryName: string) {
            this.loading = true
            this.error = null
            try {
                const categoryResponse = await categoryService.getByName(categoryName)
                return categoryResponse as Category
            } catch (err: any) {
                this.error = err.message || `Failed to fetch category ${categoryName}`
            } finally {
                this.loading = false
            }
        },
    },
})