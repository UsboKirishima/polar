<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useFriendStore } from '@/stores/friends'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faCancel, faCheck, faCross, faCrosshairs } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'vue-router'
import PageLoading from '../PageLoading.vue'
import type { Friend } from '../feed/ListItem.vue'
import type { Friendship } from '@/types/friends'
import type { User } from '@/types'
import Userinfo from '../Userinfo.vue'

// Props
const props = defineProps<{
    currentPage: 'friends' | 'requests'
    friends?: Friendship[]
    hideRemoveBtn?: boolean
}>()

// Store
const friendStore = useFriendStore()
const router = useRouter()

// Fetch data on mount depending on currentPage
onMounted(() => {
    if (props.friends) {
        friendStore.friends = props.friends
    } else {
        friendStore.fetchFriends()
    }

    friendStore.fetchPendingRequests()
})

// Computed properties to simplify template
const isFriendsPage = computed(() => props.currentPage === 'friends')
const isRequestsPage = computed(() => props.currentPage === 'requests')

const fetchAll = () => {
    friendStore.fetchFriends()
    friendStore.fetchPendingRequests()
}

// Handlers for accepting and denying friend requests
const acceptRequest = (senderId: string) => {
    friendStore.acceptRequest(senderId)
    fetchAll()
}

const denyRequest = (senderId: string) => {
    friendStore.denyRequest(senderId)
    fetchAll()
}

const openFriend = (friendId: string) => {
    window.location.href = `/users/${friendId}`
}
</script>

<template>
    <div class="friend-page">
        <PageLoading v-if="friendStore.loading" />

        <div v-else-if="friendStore.error" class="error">
            {{ friendStore.error }}
        </div>

        <div v-else-if="isFriendsPage">
            <ul v-if="friendStore.friends?.length" class="friend-list">
                <li v-for="friend in friendStore.friends" :key="friend.userId" class="friend-item">
                    <span class="username">
                        <div class="indentifier" @click="openFriend(friend.friend.id)">
                            <Userinfo :user="friend.friend as User" disable-over />
                        </div>
                    </span>
                    <div v-if="!hideRemoveBtn" class="controls">
                        <button @click="friendStore.removeFriend(friend.friendId)" class="deny-btn">
                            <FontAwesomeIcon :icon="faCancel" class="icon-btn" />
                            Remove
                        </button>
                    </div>
                </li>
            </ul>
            <p v-else class="empty">No friends yet.</p>
        </div>

        <div v-else-if="isRequestsPage">
            <ul v-if="friendStore.pendingRequests?.length" class="request-list">
                <li
                    v-for="request in friendStore.pendingRequests"
                    :key="request.id"
                    class="request-item"
                >
                    <div class="indentifier" @click="openFriend(request.senderId)">
                        <Userinfo :user="request.sender as User" disable-over />
                    </div>
                    <div class="actions">
                        <button @click="acceptRequest(request.senderId)" class="accept-btn">
                            <FontAwesomeIcon :icon="faCheck" class="icon-btn" />
                            Accept
                        </button>
                        <button @click="denyRequest(request.senderId)" class="deny-btn">
                            <FontAwesomeIcon :icon="faCancel" class="icon-btn" />
                            Deny
                        </button>
                    </div>
                </li>
            </ul>
            <p v-else class="empty">No pending requests.</p>
        </div>
    </div>
</template>

<style scoped>
.friend-page {
    padding: 1rem 0 0 0;
}

.title {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    font-weight: bold;
}

.error {
    color: red;
    text-align: center;
}

.friend-list,
.request-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.friend-item,
.request-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    margin-bottom: 0.5rem;
    background: #e1eeff33;
    background:
        radial-gradient(circle at 20% 30%, #9a9bff33, transparent 60%),
        radial-gradient(circle at 80% 70%, #f081ff1a, transparent 60%);
    transition: 100ms;
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    z-index: 10;
    background-attachment: fixed;
}

.friend-item:hover,
.request-item:hover {
    opacity: 75%;
    transition: 100ms;
}

.indentifier {
    display: flex;
    align-items: center;
    cursor: pointer;
    z-index: 100;
}

.indentifier img {
    width: 40px;
}

.actions {
    display: flex;
    gap: 0.5rem;
}

.accept-btn,
.deny-btn {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    color: white;
    border: none;
    width: 6rem;
    font-weight: 500;
    font-size: 0.9rem;
    padding: 0.7rem 0.8rem;
    border-radius: 5px;
    cursor: pointer;
    background: #1c2532;
    transition: 300ms;
    z-index: 89;
}

.accept-btn:hover {
    background: #4caf4f30;
    transition: 300ms;
    color: #fff;
}

.deny-btn:hover {
    background: #ea5a0c30;
    transition: 300ms;
    color: #fff;
}

.icon-btn {
    margin-right: 5px;
}

.accept-btn {
    color: #4caf50;
    background: #ff6a6a1f;
}

.deny-btn {
    color: #ea580c;
    background: #ff6a6a1f;
}

.empty {
    text-align: center;
    color: #777;
    margin: 30vh 0;
}
</style>
