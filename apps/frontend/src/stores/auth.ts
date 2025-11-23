import { defineStore } from 'pinia'
import api from '@/axiosApi'
import * as services from '../interface';
import { trpc } from '@/trpc';
import { useLogStore } from './logs';

type User = Awaited<ReturnType<typeof trpc.user.getMe.query>>;

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null as null | User,
        isLoggedIn: false,
        loading: false,
    }),

    actions: {

        async login(email: string, password: string) {
            const logs = useLogStore()

            try {
                this.loading = true

                const res = await services.auth.login({ email, password })

                localStorage.setItem('token', res.accessToken)
                await this.checkAuth()

                logs.showSuccess(`Logged in as ${email}`)
                return true

            } catch (err: any) {
                logs.showErr(err?.response?.message || 'Login failed')
                return false

            } finally {
                this.loading = false
            }
        },

        async register(
            email: string,
            password: string,
            username: string,
            dateOfBirth: Date,
            fullName: string,
        ) {
            const logs = useLogStore()

            try {
                this.loading = true

                // Optional API call (your original code)
                await api.post('/auth/register', {
                    email,
                    password,
                    profile: {
                        username,
                        dateOfBirth,
                        fullName,
                    },
                })

                // TRPC/Register actual call
                const result = await services.auth.register({
                    email,
                    password,
                    profile: {
                        username,
                        dateOfBirth,
                        fullName
                    }
                })

                logs.showSuccess(`Registered account for ${email}`)
                return result

            } catch (err: any) {
                logs.showErr(err?.response?.message || 'Registration failed')
                return false

            } finally {
                this.loading = false
            }
        },

        async checkAuth() {
            const logs = useLogStore()

            try {
                const res = await services.auth.checkAuth()
                this.user = res
                this.isLoggedIn = true
            } catch (err) {
                this.user = null
                this.isLoggedIn = false
                logs.showErr('Authentication check failed')
            }
        },

        logout() {
            const logs = useLogStore()

            localStorage.removeItem('token')
            this.user = null
            this.isLoggedIn = false

            logs.showSuccess('Logged out successfully')
        },
    },
})
