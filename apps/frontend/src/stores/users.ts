import { defineStore } from 'pinia'
import * as services from '../interface';
import { trpc } from '@/trpc';

type Users = Awaited<ReturnType<typeof trpc.user.getAll.query>>

export const useUserStore = defineStore('user', {
    state: () => ({
        users: null as null | Users,
        loading: false,
        error: null as string | null,
    }),
    actions: {
        async fetchUsers() {
            const response = await services.user.fetchUsers();
            this.users = response;
        },
        async getUserById(userId: string) {
            this.loading = true
            this.error = null
            try {
                const response = await services.user.getUserById(userId);
                return response
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
                const response = await services.user.getAllFriendsByUserId(userId)
                return response
            } catch (err: any) {
                this.error = err.response?.data?.message || 'Failed to fetch user'
            } finally {
                this.loading = false
            }
        },
    },
})
