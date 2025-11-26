import { defineStore } from 'pinia'

const NOTIFICATION_TIME_MS = 4000

export const useLogStore = defineStore('logs', {
    state: () => ({
        type: null as 'err' | 'succ' | 'msg' | null,
        error: null as string | null,
        success: null as string | null,
        message: null as string | null,
    }),
    actions: {
        showErr(msg: string) {
            this.error = msg
            this.type = 'err'
            setTimeout(() => {
                this.error = null
                this.type = null
            }, NOTIFICATION_TIME_MS)
        },
        showSuccess(msg: string) {
            this.success = msg
            this.type = 'succ'
            setTimeout(() => {
                this.success = null
                this.type = null
            }, NOTIFICATION_TIME_MS)
        },
        showInfo(msg: string) {
            this.message = msg
            this.type = 'msg'
            setTimeout(() => {
                this.message = null
                this.type = null
            }, NOTIFICATION_TIME_MS)
        },
    },
})
