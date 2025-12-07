<script setup lang="ts">
import type { Post, User } from '@/types/trpc'
import Username from '../UserName.vue'
import { useFriendStore } from '@/stores/friends'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
    faAdd,
    faCheck,
    faEdit,
    faSignOut
} from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { onMounted, ref } from 'vue'

const props = defineProps<{
    isProfilePage: boolean
    user: User | null
    posts: Post[]
    friends: any[]
}>()

const isFriendRequested = ref<boolean>(false)

const auth = useAuthStore()
const router = useRouter()
const friendStore = useFriendStore()

const handleOpenSettings = () => {
    router.push(`/profile/settings`)
}

const handleAddFriend = async () => {
    if (props.user) await friendStore.sendRequest(props.user?.id)
    await friendStore.fetchPendingRequests()
    await friendStore.fetchFriends()
    await refreshFriends()
    isFriendRequested.value = true
}

const refreshFriends = async () => {
    if (
        friendStore.pendingRequests?.some((f) => f.receiverId === props.user?.id) ||
        friendStore.friends?.some((f) => f.friendId === props.user?.id)
    )
        isFriendRequested.value = true
}

const logout = () => {
    auth.logout()
    window.location.href = '/login'
}

onMounted(async () => {
    await refreshFriends()
})
</script>

<template>
    <div class="container">
        <div class="photos">
            <div class="bg-container">
                <img class="bg" :src="user?.profile?.banner?.url ?? '/bg_placeholder.jpg'" alt="" />
            </div>
            <img class="pfp" :src="user?.profile?.avatar?.url ?? '/pfp_placeholder.png'" alt="" />
        </div>
        <div class="main">
            <div class="info">
                <Username :username="user!.profile?.fullName || ''" :is-verified="user!.role === 'ADMIN' || false"
                    class="username" />
                <p class="tag">@{{ user!.profile?.username || 'unknown' }}</p>
                <p class="bio">
                    {{ user!.profile?.bio == 'unknown' ? 'no bio yet' : user!.profile?.bio }}
                </p>
                <p class="join-date">
                    Joined {{ new Date(user!.createdAt).toUTCString().slice(0, 16) }}
                </p>
            </div>
            <div class="stats">
                <div class="stats-box">
                    <div>
                        <p>{{ friends.length }}</p>
                        <p class="desc">Friends</p>
                    </div>
                    <div>
                        <p>{{ posts.length }}</p>
                        <p class="desc">Posts</p>
                    </div>
                    <div>
                        <p>{{ user!.likes.length }}</p>
                        <p class="desc">Likes</p>
                    </div>
                    <div>
                        <p v-if="!isProfilePage" @click="handleAddFriend" id="add-friend">
                            <FontAwesomeIcon :icon="isFriendRequested ? faCheck : faAdd" />
                        </p>
                        <p v-else @click="handleOpenSettings">
                            <FontAwesomeIcon id="add-friend" :icon="faEdit" />
                        </p>
                    </div>
                    <div v-if="isProfilePage" @click="logout">
                        <p id="add-friend">
                            <FontAwesomeIcon :icon="faSignOut" />
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.container {
    width: 70%;
    background-color: #a5a6ff13;
    border-radius: 16px;
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.photos {
    display: block;
    position: relative;
}

.bg-container {
    display: block;
    position: relative;
    width: 100%;
    height: 250px;
    overflow: hidden;
    border-radius: 16px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
    object-fit: cover;
}

.bg {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    display: block;
}

.pfp {
    aspect-ratio: 1/1;
    width: 120px;
    border-radius: 20%;
    border: 2px solid hsla(261, 100%, 87%, 0.459);
    padding: 2px;
    position: absolute;
    object-fit: cover;
    bottom: -3rem;
    left: 5rem;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.main {
    margin-top: 5rem;
    display: flex;
    flex-direction: row;
}

.info {
    margin-left: 5rem;
    width: 100%;
}

.username {
    font-size: 1.7rem;
}

.tag {
    color: #ffffff8a;
}

.bio {
    margin-top: 1.5rem;
    margin-bottom: 1.5rem;
}

.join-date {
    font-size: 0.8rem;
    color: #ffffff71;
}

.stats {
    width: 40%;
    display: flex;
    justify-content: center;
    align-items: start;
}

.stats-box {
    display: flex;
    width: 60%;
    background: #a5a6ff13;
    padding: 1rem;
    align-items: center;
    justify-content: center;
    border-radius: 16px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.stats-box div {
    width: 6rem;
    margin: 0 auto;
}

.stats-box div p {
    font-weight: 700;
    color: #fff;
    font-size: 1.2rem;
    text-align: center;
}

.stats-box div .desc {
    font-weight: 400;
    color: #ffffff83;
    font-size: 0.85rem;
}

#add-friend {
    cursor: pointer;
    transition: 300ms;
}

#add-friend:hover {
    opacity: 75%;
    transition: 300ms;
}
</style>
