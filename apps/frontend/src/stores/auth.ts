import { defineStore } from 'pinia'
import api from '@/axiosApi'
import * as services from '../interface';
import { trpc } from '@/trpc';

type User = Awaited<ReturnType<typeof trpc.user.getMe.query>>;

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null as null | User,
        isLoggedIn: false,
        loading: false,
    }),

    actions: {
        async login(email: string, password: string) {
            try {
                this.loading = true
                const res = await services.auth.login({
                    email,
                    password
                })
                
                localStorage.setItem('token', res.accessToken)
                await this.checkAuth()

                return true;
            } catch (err) {
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
            try {
                this.loading = true
                const res = await api.post('/auth/register', {
                    email: email,
                    password: password,
                    profile: {
                        username,
                        dateOfBirth,
                        fullName,
                    },
                })

                return await services.auth.register({
                    email: email,
                    password: password,
                    profile: {
                        username: username,
                        dateOfBirth: dateOfBirth,
                        fullName: fullName
                    }
                })
            } catch (err) {
                return false
            } finally {
                this.loading = false
            }
        },

        async checkAuth() {
            try {
                const res = await services.auth.checkAuth();
                this.user = res
                this.isLoggedIn = true
            } catch(err) {
                this.user = null
                this.isLoggedIn = false
            }
        },

        logout() {
            localStorage.removeItem('token')
            this.user = null
            this.isLoggedIn = false
        },
    },
})
