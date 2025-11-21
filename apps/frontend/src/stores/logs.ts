import { defineStore } from 'pinia'

export const useLogStore = defineStore('logs', {
    state: () => ({
        type: null as 'err' | 'succ' | 'msg' | null,
        error: null as string | null,
        success: null as string | null,
        message: null as string | null
    }),
    actions: {
        showErr(msg: string) {
            this.error = msg
            this.type = 'err'
            setTimeout(() => {
                this.error = null
                this.type = null
            }, 3000)
        },
        showSuccess(msg: string) {
            this.success = msg;
            this.type = 'succ'
            setTimeout(() => {
                this.success = null
                this.type = null
            }, 3000)
        },
        showInfo(msg: string) {
            this.message = msg;
            this.type = 'msg'
            setTimeout(() => {
                this.message = null
                this.type = null
            }, 3000)
        }
    }
})
