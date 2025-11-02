import { defineStore } from 'pinia'
import { type Avatar, type Banner, type User } from '@/types'
import {
    getUserAvatar,
    uploadUserAvatar,
    deleteUserAvatar,
    getUserBanner,
    uploadUserBanner,
    deleteUserBanner,
} from '@/api/media'
import { getUserById } from '@/api/users'

export const useSettingsStore = defineStore('settings', {
    state: () => ({
        loading: false,
        error: null as string | null,
        avatar: null as Avatar | null,
        banner: null as Banner | null,
        user: null as User | null,
    }),

    actions: {
        async handleAction<T>(fn: () => Promise<T>, errorMessage: string) {
            this.loading = true
            this.error = null
            try {
                return await fn()
            } catch (err: any) {
                this.error = err.response?.data?.message || errorMessage
                throw err
            } finally {
                this.loading = false
            }
        },

        /* ========== FETCH USER + MEDIA ========== */
        async fetchSettings(userId: string) {
            return this.handleAction(async () => {
                const userResponse = await getUserById(userId)

                this.user = userResponse.data
                this.avatar = userResponse.data.profile.avatar
                this.banner = userResponse.data.profile.banner

                return userResponse.data
            }, 'Failed to fetch settings')
        },

        /* ========== GENERIC MEDIA METHODS ========== */
        async fetchMedia(type: 'avatar' | 'banner', fetchFn: () => Promise<any>) {
            return this.handleAction(async () => {
                const response = await fetchFn()
                this[type] = response.data
                return response.data
            }, `Failed to fetch ${type}`)
        },

        async uploadMedia(
            type: 'avatar' | 'banner',
            uploadFn: (file: FormData) => Promise<any>,
            file: File,
        ) {
            return this.handleAction(async () => {
                const formData = new FormData()
                formData.append(type, file)

                const response = await uploadFn(formData)
                this[type] = response.data.data

                if (this.user?.profile) {
                    this.user.profile[type] = response.data.data
                }

                return response.data.data
            }, `Failed to upload ${type}`)
        },

        async deleteMedia(type: 'avatar' | 'banner', deleteFn: () => Promise<any>) {
            return this.handleAction(async () => {
                await deleteFn()
                this[type] = null
                if (this.user?.profile) {
                    this.user.profile[type] = null as any
                }
            }, `Failed to delete ${type}`)
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
