<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue'
import FeedHeader from '../components/feed/FeedHeader.vue'
import FeedContent from '../components/feed/FeedContent.vue'
import FeedSidebar from '../components/feed/FeedSidebar.vue'
import type { Friend, Suggestion } from '../components/feed/ListItem.vue'
import { useFriendStore } from '@/stores/friends'
import { usePostStore } from '@/stores/posts'
import PageLoading from '@/components/PageLoading.vue'
import type { User } from '@/types/trpc'
import { useUserStore } from '@/stores/users'
import { useAuthStore } from '@/stores/auth'

const friendStore = useFriendStore()
const postStore = usePostStore()
const userStore = useUserStore();
const authStore = useAuthStore();

const feedConfig = {
    page: ref<'explore' | 'friends'>('explore'),
}

const setPage = async (page: 'explore' | 'friends') => {
    await friendStore.fetchFriends()
    await postStore.fetchAllPosts()
    await userStore.fetchUsers();
    feedConfig.page.value = page
}

const suggestions = ref<User[]>([]);
const friends = ref<User[]>([]);
const verified = ref<User[]>([]);

export interface PostAuthor {
    username: string
    avatar: string
    place: string
}

export interface PostComment {
    authorId: string
    text: string
}

onMounted(async () => {
    await friendStore.fetchFriends()
    await postStore.fetchAllPosts()
    await userStore.fetchUsers();

    suggestions.value = userStore.users?.sort((a, b) => b.friends.length - a.friends.length) as User[];
    friends.value = userStore.users?.filter(u => u.friends.find(f => f.friendId === authStore.user?.id)) as User[];
    verified.value = userStore.users?.filter((u) => u.role === 'ADMIN') as User[]; 
})
</script>

<template>
    <div
        v-if="friendStore.loading || (postStore.loading && !postStore.posts.length)"
        class="loading"
    >
        <PageLoading />
    </div>
    <div v-else class="feed-container">
        <div class="feed-space">
            <FeedHeader :currentPage="feedConfig.page.value" @change-page="setPage" />
            <FeedContent :currentPage="feedConfig.page.value" :posts="postStore.posts" />
        </div>

        <FeedSidebar
            class="bar"
            :friends="friends as User[]"
            :suggestions="suggestions as User[]"
            :verified-users="verified as User[]"
        />
    </div>
</template>

<style scoped>
.feed-container {
    display: grid;
    grid-template-columns: 1fr clamp(260px, 17vw, 300px);
    min-height: 100vh;
    color: #ffffffc7;
}

.bar {
    height: 90vh;
    align-self: center;
}

.feed-space {
    padding: 0 3%;
    z-index: 70;
}

@media (max-width: 768px) {
    .feed-space {
        padding: 0;
    }

    .feed-container {
        display: flex;
        grid-template-columns: none;
        margin: 0 auto;
        justify-content: center;
        width: 100vw;
    }

    .bar {
        display: none;
    }
}
</style>
