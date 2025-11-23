import { defineStore } from 'pinia'
import * as services from '../interface';
import { trpc } from '@/trpc';
import { useLogStore } from './logs';

type Users = Awaited<ReturnType<typeof trpc.user.getAll.query>>

export const useUserStore = defineStore('user', {
    state: () => ({
        users: null as null | Users,
        loading: false,
        error: null as string | null,
    }),

    actions: {

        async fetchUsers() {
            const logs = useLogStore()

            this.loading = true
            this.error = null

            try {
                const response = await services.user.fetchUsers()
                this.users = response
            } catch (err: any) {
                const msg = err.response?.data?.message || 'Failed to fetch users'
                this.error = msg
                logs.showErr(msg)
            } finally {
                this.loading = false
            }
        },

        async getUserById(userId: string) {
            const logs = useLogStore()

            this.loading = true
            this.error = null

            try {
                const response = await services.user.getUserById(userId)
                return response
            } catch (err: any) {
                const msg = err.response?.data?.message || 'Failed to fetch user'
                this.error = msg
                logs.showErr(msg)
            } finally {
                this.loading = false
            }
        },

        async getAllFriendsByUserId(userId: string) {
            const logs = useLogStore()

            this.loading = true
            this.error = null

            try {
                const response = await services.user.getAllFriendsByUserId(userId)
                return response
            } catch (err: any) {
                const msg = err.response?.data?.message || 'Failed to fetch friends'
                this.error = msg
                logs.showErr(msg)
            } finally {
                this.loading = false
            }
        },

    },
})
