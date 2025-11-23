import { defineStore } from 'pinia'
import * as services from '@/interface';
import { useLogStore } from './logs';

type PendingRequests = Awaited<ReturnType<typeof services.friend.fetchPendingRequests>>;
type FriendsType = Awaited<ReturnType<typeof services.friend.fetchFriends>>;

export const useFriendStore = defineStore('friend', {
    state: () => ({
        pendingRequests: null as PendingRequests | null,
        friends: null as FriendsType | null,
        loading: false,
        error: null as string | null,
    }),

    actions: {

        /**
         * Fetch pending friend requests for the logged-in user
         */
        async fetchPendingRequests() {
            const logs = useLogStore();

            this.loading = true
            this.error = null

            try {
                const response = await services.friend.fetchPendingRequests();
                this.pendingRequests = response
            } catch (err: any) {
                const msg = err.response?.data?.message || 'Failed to fetch pending requests'
                this.error = msg
                logs.showErr(msg)
            } finally {
                this.loading = false
            }
        },

        /**
         * Fetch all friends for the logged-in user
         */
        async fetchFriends() {
            const logs = useLogStore();

            this.loading = true
            this.error = null

            try {
                const response = await services.friend.fetchFriends();
                this.friends = response
            } catch (err: any) {
                const msg = err.response?.message || 'Failed to fetch friends'
                this.error = msg
                logs.showErr(msg)
            } finally {
                this.loading = false
            }
        },

        /**
         * Send a new friend request
         */
        async sendRequest(receiverId: string) {
            const logs = useLogStore();

            this.loading = true
            this.error = null

            try {
                await services.friend.sendRequest(receiverId);
                await this.fetchPendingRequests()

                logs.showSuccess(`Sent friend request to \`${receiverId}\``)

            } catch (err: any) {
                const msg = err.response?.message || 'Failed to send friend request'
                this.error = msg
                logs.showErr(msg)
            } finally {
                this.loading = false
            }
        },

        /**
         * Send a new friend request with given username
         */
        async sendRequestByUsername(username: string) {
            const logs = useLogStore()

            this.loading = true
            this.error = null

            try {
                await services.friend.sendRequestByUsername(username);
                await this.fetchPendingRequests()

                logs.showSuccess(`Sent friend request to @${username}`)

            } catch (err: any) {
                const msg = err.response?.message || 'Failed to send friend request'
                this.error = msg
                logs.showErr(msg)
            } finally {
                this.loading = false
            }
        },

        /**
         * Accept a pending friend request
         */
        async acceptRequest(senderId: string) {
            const logs = useLogStore()

            this.loading = true
            this.error = null

            try {
                await services.friend.acceptRequest(senderId);
                await this.fetchFriends()
                await this.fetchPendingRequests()

                logs.showSuccess(`Accepted friend request from \`${senderId}\``)

            } catch (err: any) {
                const msg = err.response?.message || 'Failed to accept friend request'
                this.error = msg
                logs.showErr(msg)
            } finally {
                this.loading = false
            }
        },

        /**
         * Deny a pending friend request
         */
        async denyRequest(senderId: string) {
            const logs = useLogStore()

            this.loading = true
            this.error = null

            try {
                await services.friend.denyRequest(senderId)
                await this.fetchPendingRequests()

                logs.showSuccess(`Denied friend request from \`${senderId}\``)

            } catch (err: any) {
                const msg = err.response?.message || 'Failed to deny friend request'
                this.error = msg
                logs.showErr(msg)
            } finally {
                this.loading = false
            }
        },

        /**
         * Remove friend
         */
        async removeFriend(friendId: string) {
            const logs = useLogStore()

            this.loading = true
            this.error = null

            try {
                await services.friend.removeFriend(friendId)
                await this.fetchFriends()

                logs.showSuccess(`Removed friend \`${friendId}\``)

            } catch (err: any) {
                const msg = err.response?.message || 'Failed to remove friend'
                this.error = msg
                logs.showErr(msg)
            } finally {
                this.loading = false
            }
        },
    },
})
