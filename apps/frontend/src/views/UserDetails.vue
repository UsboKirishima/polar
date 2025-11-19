<script setup lang="ts">
import { ref, onMounted, watchEffect, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PageLoading from '@/components/PageLoading.vue'
import ProfileHeader from '@/components/profile/ProfileHeader.vue'
import ProfileContent from '@/components/profile/ProfileContent.vue'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { useQuery } from '@tanstack/vue-query'
import { trpc } from '@/trpc'

type UserType = Awaited<ReturnType<typeof trpc.user.getById.query>>;
type PostsType = Awaited<ReturnType<typeof trpc.user.getPosts.query>>;
type FriendsType = Awaited<ReturnType<typeof trpc.user.getFriends.query>>

const route = useRoute()
const router = useRouter()

const user = ref<UserType>();
const posts = ref<PostsType>([])
const friends = ref<FriendsType>([])
const err = ref('')

const isProfilePage = ref(false)

const goBack = () => router.go(-1)
const formatDate = (date: Date) => new Date(date).toLocaleDateString()

/* get logged user */
const { data: _auth, isLoading: isAuthLoading, error: authError } = useQuery({
    queryKey: ['me'],
    queryFn: () => trpc.user.getMe.query(),
})

/* get user by id param */
const { data: _user, isLoading: isUserLoading, error: userError } = useQuery({
    queryKey: ['user', route.params.id],
    queryFn: () => trpc.user.getById.query(route.params.id as string),
})

/* get posts reattivo */
const postsQuery = useQuery({
    queryKey: ['posts', _user.value?.id],
    queryFn: () => _user.value ? trpc.user.getPosts.query(_user.value.id) : Promise.resolve([]),
    enabled: !!_user.value, // esegue solo quando _user esiste
})

watch(() => postsQuery.data.value ?? [], (newData: PostsType) => {
    if (newData) posts.value = newData
})

/* get friends reattivo */
const friendsQuery = useQuery({
    queryKey: ['friends', _user.value?.id],
    queryFn: () => _user.value ? trpc.user.getFriends.query(_user.value.id) : Promise.resolve([]),
    enabled: !!_user.value,
})

watch(() => friendsQuery.data.value ?? [], (newData: FriendsType) => {
    if (newData) friends.value = newData
})


onMounted(() => {
    if (authError.value || userError.value) {
        err.value = 'Failed to fetch user'
    }
})
</script>

<template>
    <PageLoading v-if="isAuthLoading || isUserLoading" />
    <div v-else-if="err">
        <h1>{{ err }}</h1>
    </div>
    <div v-else>
        <div class="bar">
            <div @click="goBack" class="back-ic">
                <FontAwesomeIcon :icon="faArrowLeft" />
            </div>
            <h2>
                Profile of <b>{{ user?.profile?.fullName }}</b>
            </h2>
        </div>
        <div class="container">
            <ProfileHeader :is-profile-page="isProfilePage" :user="user" :posts="posts" :friends="friends" />
            <ProfileContent :is-profile-page="isProfilePage" :user="user" :posts="posts" :friends="friends" />
        </div>
    </div>
</template>

<style scoped>
.container {
    width: 90%;
    padding: 2rem;
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
