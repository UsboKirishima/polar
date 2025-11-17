<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PageLoading from '@/components/PageLoading.vue'
import { useUserStore } from '@/stores/users'
import { useAuthStore } from '@/stores/auth'
import ProfileHeader from '@/components/profile/ProfileHeader.vue'
import type { Post, User } from '@/types'
import { useFriendStore } from '@/stores/friends'
import { usePostStore } from '@/stores/posts'
import type { Friendship } from '@/types/friends'
import ProfileContent from '@/components/profile/ProfileContent.vue'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const route = useRoute()
const user = ref<User | null>(null)
const friends = ref<Friendship[]>([])
const posts = ref<Post[]>([])
const loading = ref(true)

const userStore = useUserStore()
const authStore = useAuthStore()
const friendStore = useFriendStore()
const postStore = usePostStore()

const isProfilePage = ref(false) /* True in case user is on its own profile. */

const router = useRouter()

const goBack = () => {
    router.go(-1)
}

const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString()
}

const fetchPosts = async () => {
    posts.value = await postStore.fetchAllPostsByUser(user.value!.id)
    if (!user.value) return
}

const fetchFriends = async () => {
    if (!user.value) return
    friends.value = await userStore.getAllFriendsByUserId(user.value.id)
}

onMounted(fetchUserData)

watch(
    () => route.params.id,
    async () => {
        loading.value = true
        await fetchUserData()
        loading.value = false
    },
)

async function fetchUserData() {
    try {
        user.value = await userStore.getUserById(route.params.id as string)
        isProfilePage.value = route.params.id === authStore.user!.id
        await fetchPosts()
        await fetchFriends()
        await userStore.fetchUsers()
        loading.value = false
    } catch (error) {
        console.error('Error during user fetch: ', error)
    }
}
</script>

<template>
    <PageLoading v-if="loading" />
    <div v-else>
        <div class="bar">
            <div @click="goBack" class="back-ic">
                <FontAwesomeIcon :icon="faArrowLeft" />
            </div>
            <h2>
                Profile of <b>{{ user?.profile.fullName }}</b>
            </h2>
        </div>
        <div class="container">
            <ProfileHeader
                :is-profile-page="isProfilePage"
                :user="user"
                :posts="[...posts]"
                :friends="friends"
            />
            <ProfileContent
                :is-profile-page="isProfilePage"
                :user="user"
                :posts="[...posts]"
                :friends="friends"
                :comments="user?.comments || []"
                :likes="user?.likes || []"
            />
        </div>
    </div>
</template>

<style scoped>
.container {
    width: 90%;
    padding: 2rem 2rem;
    margin: 0 auto;
}

h2 {
    font-weight: 200;
    margin-left: 10px;
}

b {
    font-weight: 700;
}

.bar {
    width: 96%;
    text-align: left;
    background: #14141bb0;
    margin: 0 auto;
    display: flex;
    align-items: center;
    padding: 2rem 1rem;
    position: sticky;
    backdrop-filter: blur(6px);
    top: 0;
    z-index: 90;
}

.back-ic {
    cursor: pointer;
    transition: 300ms;
    color: #fff;
}

.back-ic:hover {
    opacity: 70%;
    transition: 300ms;
}
</style>
