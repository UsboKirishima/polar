<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue'
import FeedHeader from '../components/feed/FeedHeader.vue'
import FeedContent from '../components/feed/FeedContent.vue'
import FeedSidebar from '../components/feed/FeedSidebar.vue'
import type { Friend, Suggestion } from '../components/feed/ListItem.vue'
import { useFriendStore } from '@/stores/friends'
import { usePostStore } from '@/stores/posts'
import PageLoading from '@/components/PageLoading.vue'

const friendStore = useFriendStore();
const postStore = usePostStore();

const feedConfig = {
    page: ref<'explore' | 'friends'>('explore')
}

const setPage = async (page: 'explore' | 'friends') => {
    await friendStore.fetchFriends();
    await postStore.fetchAllPosts();
    feedConfig.page.value = page;
}

const suggestions = ref<Suggestion[]>([
    { username: 'giovy99', avatar: 'https://randomuser.me/api/portraits/men/14.jpg', friendsCount: 27 },
    { username: 'm4rko', avatar: 'https://randomuser.me/api/portraits/men/35.jpg', friendsCount: 14 },
    { username: 'stella_xx', avatar: 'https://randomuser.me/api/portraits/women/22.jpg', friendsCount: 41 },
    { username: 'panda_nerd', avatar: 'https://randomuser.me/api/portraits/men/48.jpg', friendsCount: 33 },
    { username: 'z3r0', avatar: 'https://randomuser.me/api/portraits/men/77.jpg', friendsCount: 18 },
    { username: 'cloudy_', avatar: 'https://randomuser.me/api/portraits/women/29.jpg', friendsCount: 25 },
    { username: 't3kko', avatar: 'https://randomuser.me/api/portraits/men/62.jpg', friendsCount: 36 },
    { username: 'kiara_vibes', avatar: 'https://randomuser.me/api/portraits/women/50.jpg', friendsCount: 19 },
    { username: 'ricko_', avatar: 'https://randomuser.me/api/portraits/men/84.jpg', friendsCount: 21 },
    { username: 'leo_98', avatar: 'https://randomuser.me/api/portraits/men/18.jpg', friendsCount: 30 },
    { username: 'jessy_b', avatar: 'https://randomuser.me/api/portraits/women/47.jpg', friendsCount: 12 },
    { username: 'axel_dev', avatar: 'https://randomuser.me/api/portraits/men/39.jpg', friendsCount: 37 },
    { username: 'sakura_chan', avatar: 'https://randomuser.me/api/portraits/women/33.jpg', friendsCount: 28 },
    { username: 'bl4ckcat', avatar: 'https://randomuser.me/api/portraits/men/72.jpg', friendsCount: 16 },
    { username: 'noah_', avatar: 'https://randomuser.me/api/portraits/men/25.jpg', friendsCount: 23 },
]);

const friends = ref<Friend[]>([
    { username: 'stella_xx', avatar: 'https://randomuser.me/api/portraits/women/22.jpg', newPostsCount: 12 },
    { username: 'z3r0', avatar: 'https://randomuser.me/api/portraits/men/77.jpg', newPostsCount: 5 },
    { username: 'cloudy_', avatar: 'https://randomuser.me/api/portraits/women/29.jpg', newPostsCount: 19 },
    { username: 'panda_nerd', avatar: 'https://randomuser.me/api/portraits/men/48.jpg', newPostsCount: 7 },
    { username: 'm4rko', avatar: 'https://randomuser.me/api/portraits/men/35.jpg', newPostsCount: 3 },
    { username: 't3kko', avatar: 'https://randomuser.me/api/portraits/men/62.jpg', newPostsCount: 16 },
    { username: 'giovy99', avatar: 'https://randomuser.me/api/portraits/men/14.jpg', newPostsCount: 8 },
    { username: 'kiara_vibes', avatar: 'https://randomuser.me/api/portraits/women/50.jpg', newPostsCount: 6 },
    { username: 'ricko_', avatar: 'https://randomuser.me/api/portraits/men/84.jpg', newPostsCount: 11 },
    { username: 'leo_98', avatar: 'https://randomuser.me/api/portraits/men/18.jpg', newPostsCount: 20 },
    { username: 'jessy_b', avatar: 'https://randomuser.me/api/portraits/women/47.jpg', newPostsCount: 9 },
    { username: 'axel_dev', avatar: 'https://randomuser.me/api/portraits/men/39.jpg', newPostsCount: 4 },
    { username: 'sakura_chan', avatar: 'https://randomuser.me/api/portraits/women/33.jpg', newPostsCount: 15 },
    { username: 'bl4ckcat', avatar: 'https://randomuser.me/api/portraits/men/72.jpg', newPostsCount: 13 },
    { username: 'noah_', avatar: 'https://randomuser.me/api/portraits/men/25.jpg', newPostsCount: 10 },
]);


export interface PostAuthor {
    username: string;
    avatar: string;
    place: string;
}

export interface PostComment {
    authorId: string;
    text: string;
}

export interface Post {
    author: PostAuthor;
    category: string;
    likes: number;
    comments: PostComment[];
    text: string;
}

onMounted(async () => {
    friendStore.fetchFriends();
    await postStore.fetchAllPosts();
})
</script>

<template>

    <div v-if="friendStore.loading || postStore.loading && !postStore.posts.length" class="loading">
        <PageLoading />
    </div>
    <div v-else class="feed-container">
        <div class="feed-space">
            <FeedHeader :currentPage="feedConfig.page.value" @change-page="setPage" />
            <FeedContent :currentPage="feedConfig.page.value" :posts="postStore.posts" />
        </div>

        <FeedSidebar class="bar" :friends="[...friends.values()]" :suggestions="[...suggestions.values()]" />
    </div>
</template>

<style scoped>
.feed-container {
    display: grid;
    grid-template-columns: 1fr 17%;
    min-height: 100vh;
    color: #ffffffc7;
}

.feed-space {
    padding: 0 3%;
    z-index: 70;
}

@media (max-width: 768px) {
    .bar {
        display: none;
    }
}
</style>
