import { defineStore } from 'pinia'
import { getAllFriendsByUserId, getAllUsers, getUserById } from '@/api/users'
import type { User } from '@/types'

export const useUserStore = defineStore('user', {
    state: () => ({
        users: null as null | Array<User>,
        loading: false,
        error: null as string | null,
    }),
    actions: {
        async fetchUsers() {
            const response = await getAllUsers()
            this.users = response.data
        },
        async getUserById(userId: string) {
            this.loading = true
            this.error = null
            try {
                const response = await getUserById(userId)
                return response.data
            } catch (err: any) {
                this.error = err.response?.data?.message || 'Failed to fetch user'
            } finally {
                this.loading = false
            }
        },
        async getAllFriendsByUserId(userId: string) {
            this.loading = true
            this.error = null
            try {
                const response = await getAllFriendsByUserId(userId)
                return response.data
            } catch (err: any) {
                this.error = err.response?.data?.message || 'Failed to fetch user'
            } finally {
                this.loading = false
            }
        },
    },
})
