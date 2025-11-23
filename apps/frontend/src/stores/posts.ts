import { defineStore } from 'pinia'
import * as postService from '@/interface/post-interface'
import * as categoryService from '@/interface/category-interface'
import type { Post, Category } from '@/types/trpc'
import { useLogStore } from './logs'

export const usePostStore = defineStore('post', {
    state: () => ({
        posts: [] as Post[],
        myPosts: [] as Post[],
        categories: [] as Category[],
        loading: false,
        error: null as string | null,
        isLike: false
    }),

    actions: {

        async fetchAllPosts() {
            const logs = useLogStore()

            this.loading = true
            this.error = null
            try {
                const response = await postService.getAll()
                this.posts = response as unknown as Post[]
            } catch (err: any) {
                const msg = err.message || 'Failed to fetch all posts'
                this.error = msg
                logs.showErr(msg)
            } finally {
                this.loading = false
            }
        },

        async fetchPostById(postId: string, skipLoading = false) {
            const logs = useLogStore()

            if (skipLoading) this.loading = true;
            this.error = null
            try {
                return await postService.getById(postId)
            } catch (err: any) {
                const msg = err.message || 'Failed to fetch post'
                this.error = msg
                logs.showErr(msg)
            } finally {
                this.loading = false
            }
        },

        async fetchAllPostsByUser(userId: string) {
            const logs = useLogStore()

            this.loading = true
            this.error = null
            try {
                const response = await postService.getByUser(userId)
                this.myPosts = response as unknown as Post[]
                return response
            } catch (err: any) {
                const msg = err.message || "Failed to fetch user's posts"
                this.error = msg
                logs.showErr(msg)
            } finally {
                this.loading = false
            }
        },

        async createNewPost(text: string, categories: { name: string }[], color: string) {
            const logs = useLogStore()

            this.loading = true
            this.error = null
            try {
                /* @ts-ignore */
                const response = await postService.create({ text, categories, color })
                this.posts.unshift(response as unknown as Post)
                logs.showSuccess('Post created successfully')
            } catch (err: any) {
                const msg = err.message || 'Failed to create post'
                this.error = msg
                logs.showErr(msg)
            } finally {
                this.loading = false
            }
        },

        async deletePost(postId: string) {
            const logs = useLogStore()

            this.loading = true
            this.error = null
            try {
                await postService.deleteById(postId)

                this.posts = this.posts.filter((p) => p.id !== postId)
                this.myPosts = this.myPosts.filter((p) => p.id !== postId)

                logs.showSuccess('Post deleted successfully')
            } catch (err: any) {
                const msg = err.message || 'Failed to delete post'
                this.error = msg
                logs.showErr(msg)
            } finally {
                this.loading = false
            }
        },

        async togglePostLike(postId: string) {
            const logs = useLogStore()

            this.isLike = true;
            this.loading = false // disable loading
            this.error = null
            try {
                await postService.toggleLike(postId)

                const refreshedPost = await this.fetchPostById(postId, true)
                if (!refreshedPost) return

                const index = this.posts.findIndex((p) => p.id === postId)
                if (index !== -1) this.posts[index] = refreshedPost

            } catch (err: any) {
                const msg = err.message || 'Failed to toggle like'
                this.error = msg
                logs.showErr(msg)
            } finally {
                this.loading = false
                this.isLike = false;
            }
        },

        async addPostComment(postId: string, text: string) {
            const logs = useLogStore()

            this.loading = true
            this.error = null
            try {
                await postService.addComment({ postId, text })

                const index = this.posts.findIndex((p) => p.id === postId)
                if (index !== -1) {
                    const refreshedPost = await this.fetchPostById(postId)
                    if (refreshedPost) this.posts[index] = refreshedPost
                }

                logs.showSuccess('Comment added successfully')
            } catch (err: any) {
                const msg = err.message || 'Failed to add comment'
                this.error = msg
                logs.showErr(msg)
            } finally {
                this.loading = false
            }
        },

        async removePostComment(postId: string, commentId: string) {
            const logs = useLogStore()

            this.loading = true
            this.error = null
            try {
                await postService.removeComment(commentId)

                const i = this.posts.findIndex((p) => p.id === postId)
                if (i !== -1) {
                    const refreshed = await this.fetchPostById(postId)
                    if (refreshed) this.posts[i] = refreshed
                }

                logs.showSuccess('Comment removed successfully')
            } catch (err: any) {
                const msg = err.message || 'Failed to remove comment'
                this.error = msg
                logs.showErr(msg)
            } finally {
                this.loading = false
            }
        },

        /**
         * Categories
         */
        async fetchAllCategories() {
            const logs = useLogStore()

            this.loading = true
            this.error = null
            try {
                const categories = await categoryService.getAll()
                this.categories = categories as Category[]
                return categories
            } catch (err: any) {
                const msg = err.message || 'Failed to fetch categories'
                this.error = msg
                logs.showErr(msg)
            } finally {
                this.loading = false
            }
        },

        async getCategoryById(categoryId: number) {
            const logs = useLogStore()

            this.loading = true
            this.error = null
            try {
                return await categoryService.getById(categoryId)
            } catch (err: any) {
                const msg = err.message || `Failed to fetch category ${categoryId}`
                this.error = msg
                logs.showErr(msg)
            } finally {
                this.loading = false
            }
        },

        async getCategoryByName(categoryName: string) {
            const logs = useLogStore()

            this.loading = true
            this.error = null
            try {
                return await categoryService.getByName(categoryName)
            } catch (err: any) {
                const msg = err.message || `Failed to fetch category ${categoryName}`
                this.error = msg
                logs.showErr(msg)
            } finally {
                this.loading = false
            }
        },
    },
})
