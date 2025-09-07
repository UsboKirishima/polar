<script setup lang="ts">
import { onMounted, computed } from "vue";
import { useFriendStore } from "@/stores/friends";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faCancel, faCheck, faCross, faCrosshairs } from "@fortawesome/free-solid-svg-icons";

// Props
const props = defineProps<{
    currentPage: "friends" | "requests";
}>();

// Store
const friendStore = useFriendStore();

// Fetch data on mount depending on currentPage
onMounted(() => {
    friendStore.fetchFriends();
    friendStore.fetchPendingRequests();
});

// Computed properties to simplify template
const isFriendsPage = computed(() => props.currentPage === "friends");
const isRequestsPage = computed(() => props.currentPage === "requests");

const fetchAll = () => {
    friendStore.fetchFriends()
    friendStore.fetchPendingRequests()
}

// Handlers for accepting and denying friend requests
const acceptRequest = (senderId: string) => {
    friendStore.acceptRequest(senderId);
    fetchAll();
};

const denyRequest = (senderId: string) => {
    friendStore.denyRequest(senderId);
    fetchAll();
};
</script>

<template>
    <div class="friend-page">
        <div v-if="friendStore.loading" class="loading">Loading...</div>

        <div v-else-if="friendStore.error" class="error">
            {{ friendStore.error }}
        </div>

        <div v-else-if="isFriendsPage">
            <ul v-if="friendStore.friends?.length" class="friend-list">
                <li v-for="friend in friendStore.friends" :key="friend.id" class="friend-item">
                    <span class="username">
                        <div class="indentifier">
                            <img src="/pfp_placeholder.png" alt="">
                            <div class="info">
                                <span class="username">
                                    {{ friend.friend.profile?.fullName }}
                                </span>
                                <span class="tag">
                                    @{{ friend.friend.profile?.username }}
                                </span>
                            </div>
                        </div>
                    </span>
                </li>
            </ul>
            <p v-else class="empty">You have no friends yet.</p>
        </div>

        <div v-else-if="isRequestsPage">
            <ul v-if="friendStore.pendingRequests?.length" class="request-list">
                <li v-for="request in friendStore.pendingRequests" :key="request.id" class="request-item">
                    <div class="indentifier">
                        <img src="/pfp_placeholder.png" alt="">
                        <div class="info">
                            <span class="username">
                                {{ request.sender.profile?.fullName }}
                            </span>
                            <span class="tag">
                                @{{ request.sender.profile?.username }}
                            </span>
                        </div>
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

.loading {
    color: #666;
    text-align: center;
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
    background: #374151;
}

.indentifier {
    display: flex;
    align-items: center;
}

.info {
    display: flex;
    flex-direction: column;
    color: #fff;
    margin-left: 10px;
}

.tag {
    font-size: 0.9rem;
    font-weight: 400;
    color: #ffffff8c;
}

img {
    width: 50px;
    border-radius: 100%;
}

.username {
    font-weight: 700;
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

}

.accept-btn:hover {
    background: #4caf4f8f;
    transition: 300ms;
    color: #fff;
}

.deny-btn:hover {
    background: #ea580c8f;
    transition: 300ms;
    color: #fff;
}

.icon-btn {
    margin-right: 5px;
}

.accept-btn {
    color: #4caf50;
    border: 1px solid #4caf50;
}

.deny-btn {
    color: #ea580c;
    border: 1px solid #ea580c;
}

.empty {
    text-align: center;
    color: #777;
    margin: 30vh 0;
}
</style>
