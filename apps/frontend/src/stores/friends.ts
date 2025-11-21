import { defineStore } from 'pinia'
import * as services from '@/interface';

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
            this.loading = true
            this.error = null
            try {
                const response = await services.friend.fetchPendingRequests();
                this.pendingRequests = response
            } catch (err: any) {
                this.error = err.response?.data?.message || 'Failed to fetch pending requests'
            } finally {
                this.loading = false
            }
        },

        /**
         * Fetch all friends for the logged-in user
         */
        async fetchFriends() {
            this.loading = true
            this.error = null
            try {
                const response = await services.friend.fetchFriends();
                this.friends = response
            } catch (err: any) {
                this.error = err.response?.message || 'Failed to fetch friends'
            } finally {
                this.loading = false
            }
        },

        /**
         * Send a new friend request
         */
        async sendRequest(receiverId: string) {
            this.loading = true
            this.error = null
            try {
                await services.friend.sendRequest(receiverId);
                await this.fetchPendingRequests() // refresh requests
            } catch (err: any) {
                this.error = err.response?.message || 'Failed to send friend request'
            } finally {
                this.loading = false
            }
        },

        /**
         * Send a new friend request with given username
         */
        async sendRequestByUsername(username: string) {
            this.loading = true
            this.error = null
            try {
                await services.friend.sendRequestByUsername(username);
                await this.fetchPendingRequests() // refresh requests
            } catch (err: any) {
                this.error = err.response?.message || 'Failed to send friend request'
            } finally {
                this.loading = false
            }
        },

        /**
         * Accept a pending friend request
         */
        async acceptRequest(senderId: string) {
            this.loading = true
            this.error = null
            try {
                await services.friend.acceptRequest(senderId);
                await this.fetchFriends() // refresh friend list
                await this.fetchPendingRequests() // refresh pending list
            } catch (err: any) {
                this.error = err.response?.message || 'Failed to accept friend request'
            } finally {
                this.loading = false
            }
        },

        /**
         * Deny a pending friend request
         */
        async denyRequest(senderId: string) {
            this.loading = true
            this.error = null
            try {
                await services.friend.denyRequest(senderId)
                await this.fetchPendingRequests() // refresh pending list
            } catch (err: any) {
                this.error = err.response?.message || 'Failed to deny friend request'
            } finally {
                this.loading = false
            }
        },

        /**
         * Remove friend
         */
        async removeFriend(friendId: string) {
            this.loading = true
            this.error = null
            try {
                await services.friend.removeFriend(friendId)
                await this.fetchFriends()
            } catch (err: any) {
                this.error = err.response?.message || 'Failed to remove friend'
            } finally {
                this.loading = false
            }
        },
    },
})
