import { defineStore } from 'pinia'
import type { Avatar, Banner, User } from '@/types/trpc'
import {
    getUserAvatar,
    uploadUserAvatar,
    deleteUserAvatar,
    getUserBanner,
    uploadUserBanner,
    deleteUserBanner,
} from '@/api/media'
import { getUserById } from '@/api/users'
import { useLogStore } from './logs'

export const useSettingsStore = defineStore('settings', {
    state: () => ({
        loading: false,
        error: null as string | null,
        avatar: null as Avatar | null,
        banner: null as Banner | null,
        user: null as User | null,
    }),

    actions: {
        /* ========== GENERIC ACTION WRAPPER WITH LOGS ========== */
        async handleAction<T>(fn: () => Promise<T>, errorMessage: string, successMessage?: string) {
            const logs = useLogStore()

            this.loading = true
            this.error = null

            try {
                const result = await fn()

                if (successMessage) {
                    logs.showSuccess(successMessage)
                }

                return result
            } catch (err: any) {
                const msg = err.response?.data?.message || errorMessage
                this.error = msg
                logs.showErr(msg)
                throw err
            } finally {
                this.loading = false
            }
        },

        /* ========== FETCH USER + MEDIA ========== */
        async fetchSettings(userId: string) {
            return this.handleAction(
                async () => {
                    const userResponse = await getUserById(userId)

                    this.user = userResponse.data
                    this.avatar = userResponse.data.profile.avatar
                    this.banner = userResponse.data.profile.banner

                    return userResponse.data
                },
                'Failed to fetch settings',
                'Settings loaded',
            )
        },

        /* ========== GENERIC MEDIA METHODS ========== */
        async fetchMedia(type: 'avatar' | 'banner', fetchFn: () => Promise<any>) {
            return this.handleAction(
                async () => {
                    const response = await fetchFn()
                    this[type] = response.data
                    return response.data
                },
                `Failed to fetch ${type}`,
                `${type.charAt(0).toUpperCase() + type.slice(1)} fetched`,
            )
        },

        async uploadMedia(
            type: 'avatar' | 'banner',
            uploadFn: (file: FormData) => Promise<any>,
            file: File,
        ) {
            return this.handleAction(
                async () => {
                    const formData = new FormData()
                    formData.append(type, file)

                    const response = await uploadFn(formData)
                    this[type] = response.data.data

                    if (this.user?.profile) {
                        this.user.profile[type] = response.data.data
                    }

                    return response.data.data
                },
                `Failed to upload ${type}`,
                `${type.charAt(0).toUpperCase() + type.slice(1)} updated`,
            )
        },

        async deleteMedia(type: 'avatar' | 'banner', deleteFn: () => Promise<any>) {
            return this.handleAction(
                async () => {
                    await deleteFn()
                    this[type] = null

                    if (this.user?.profile) {
                        this.user.profile[type] = null as any
                    }
                },
                `Failed to delete ${type}`,
                `${type.charAt(0).toUpperCase() + type.slice(1)} removed`,
            )
        },

        /* ========== AVATAR ========== */
        fetchAvatar() {
            return this.fetchMedia('avatar', getUserAvatar)
        },

        uploadAvatar(file: File) {
            return this.uploadMedia('avatar', uploadUserAvatar, file)
        },

        deleteAvatar() {
            return this.deleteMedia('avatar', deleteUserAvatar)
        },

        /* ========== BANNER ========== */
        fetchBanner() {
            return this.fetchMedia('banner', getUserBanner)
        },

        uploadBanner(file: File) {
            return this.uploadMedia('banner', uploadUserBanner, file)
        },

        deleteBanner() {
            return this.deleteMedia('banner', deleteUserBanner)
        },
    },
})
