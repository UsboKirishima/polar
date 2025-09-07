import { defineStore } from "pinia";
import type { FriendRequest, Friendship } from "@/types/friends";
import {
    getPendingFriendRequests,
    getFriends,
    sendFriendRequest,
    acceptFriendRequest,
    denyFriendRequest
} from "@/api/friends";

export const useFriendStore = defineStore("friend", {
    state: () => ({
        pendingRequests: null as FriendRequest[] | null,
        friends: null as Friendship[] | null,
        loading: false,
        error: null as string | null
    }),
    actions: {
        /**
         * Fetch pending friend requests for the logged-in user
         */
        async fetchPendingRequests() {
            this.loading = true;
            this.error = null;
            try {
                const response = await getPendingFriendRequests();
                this.pendingRequests = response.data.requests;
            } catch (err: any) {
                this.error = err.response?.data?.message || "Failed to fetch pending requests";
            } finally {
                this.loading = false;
            }
        },

        /**
         * Fetch all friends for the logged-in user
         */
        async fetchFriends() {
            this.loading = true;
            this.error = null;
            try {
                const response = await getFriends();
                this.friends = response.data.friends;
            } catch (err: any) {
                this.error = err.response?.data?.message || "Failed to fetch friends";
            } finally {
                this.loading = false;
            }
        },

        /**
         * Send a new friend request
         */
        async sendRequest(receiverId: string) {
            this.loading = true;
            this.error = null;
            try {
                await sendFriendRequest(receiverId);
                await this.fetchPendingRequests(); // refresh requests
            } catch (err: any) {
                this.error = err.response?.data?.message || "Failed to send friend request";
            } finally {
                this.loading = false;
            }
        },

        /**
         * Accept a pending friend request
         */
        async acceptRequest(senderId: string) {
            this.loading = true;
            this.error = null;
            try {
                await acceptFriendRequest(senderId);
                await this.fetchFriends(); // refresh friend list
                await this.fetchPendingRequests(); // refresh pending list
            } catch (err: any) {
                this.error = err.response?.data?.message || "Failed to accept friend request";
            } finally {
                this.loading = false;
            }
        },

        /**
         * Deny a pending friend request
         */
        async denyRequest(senderId: string) {
            this.loading = true;
            this.error = null;
            try {
                await denyFriendRequest(senderId);
                await this.fetchPendingRequests(); // refresh pending list
            } catch (err: any) {
                this.error = err.response?.data?.message || "Failed to deny friend request";
            } finally {
                this.loading = false;
            }
        }
    }
});
