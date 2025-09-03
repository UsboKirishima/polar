import { defineStore } from 'pinia';
import api from '@/api';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null as null | { id: string; email: string },
        isLoggedIn: false,
        loading: false,
    }),

    actions: {
        async login(email: string, password: string) {
            try {
                this.loading = true;
                const res = await api.post('/auth/login', { email, password });

                localStorage.setItem('token', res.data.accessToken);

                await this.checkAuth();

                return true;
            } catch (err) {
                return false;
            } finally {
                this.loading = false;
            }
        },

        async register(email: string, password: string) {
            try {
                this.loading = true;
                const res = await api.post('/auth/register', { email, password });

                return await this.login(email, password);
            } catch (err) {
                return false;
            } finally {
                this.loading = false;
            }
        },

        async checkAuth() {
            try {
                const res = await api.get('/users/profile');
                this.user = res.data;
                this.isLoggedIn = true;
            } catch {
                this.user = null;
                this.isLoggedIn = false;
                localStorage.removeItem('token');
            }
        },

        logout() {
            localStorage.removeItem('token');
            this.user = null;
            this.isLoggedIn = false;
        },
    },
});
