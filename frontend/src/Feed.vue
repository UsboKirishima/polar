<script setup lang="ts">
import { ref, type Ref } from 'vue'
import FeedHeader from './components/feed/FeedHeader.vue'
import FeedContent from './components/feed/FeedContent.vue'
import FeedSidebar from './components/feed/FeedSidebar.vue'
import type { Friend, Suggestion } from './components/feed/ListItem.vue'

const feedConfig = {
    page: ref<'explore' | 'friends'>('explore')
}

const setPage = (page: 'explore' | 'friends') => {
    feedConfig.page.value = page;
}

const suggestions = ref<Suggestion[]>([
    { username: 'usbo', avatar: '/pfp_placeholder.png', friendsCount: Math.floor(Math.random() * 50) },
    { username: 'aL3x_', avatar: '/pfp_placeholder.png', friendsCount: Math.floor(Math.random() * 50) },
    { username: 'camy_b_', avatar: '/pfp_placeholder.png', friendsCount: Math.floor(Math.random() * 50) },
    { username: 'bia', avatar: '/pfp_placeholder.png', friendsCount: Math.floor(Math.random() * 50) },
    { username: 'lott0', avatar: '/pfp_placeholder.png', friendsCount: Math.floor(Math.random() * 50) },
    { username: 'erb3tt4', avatar: '/pfp_placeholder.png', friendsCount: Math.floor(Math.random() * 50) },
    { username: 'viscida', avatar: '/pfp_placeholder.png', friendsCount: Math.floor(Math.random() * 50) },
]);

const friends = ref<Friend[]>([
    { username: 'usbo', avatar: '/pfp_placeholder.png', newPostsCount: Math.floor(Math.random() * 30) },
    { username: 'aL3x_', avatar: '/pfp_placeholder.png', newPostsCount: Math.floor(Math.random() * 30) },
    { username: 'camy_b_', avatar: '/pfp_placeholder.png', newPostsCount: Math.floor(Math.random() * 30) },
    { username: 'bia', avatar: '/pfp_placeholder.png', newPostsCount: Math.floor(Math.random() * 30) },
    { username: 'lott0', avatar: '/pfp_placeholder.png', newPostsCount: Math.floor(Math.random() * 30) },
    { username: 'erb3tt4', avatar: '/pfp_placeholder.png', newPostsCount: Math.floor(Math.random() * 30) },
    { username: 'viscida', avatar: '/pfp_placeholder.png', newPostsCount: Math.floor(Math.random() * 30) },
]);

</script>

<template>
    <div class="feed-container">
        <div class="feed-space">
            <FeedHeader :currentPage="feedConfig.page.value" @change-page="setPage" />
            <FeedContent :currentPage="feedConfig.page.value" />
        </div>

        <FeedSidebar :friends="[...friends.values()]" :suggestions="[...suggestions.values()]" />
    </div>
</template>

<style scoped>
.feed-container {
    display: grid;
    grid-template-columns: 1fr 20.3%;
    min-height: 100vh;
    color: #ffffffc7;
}

.feed-space {
    width: 100%;
    padding: 2%;
    z-index: 70;
}
</style>
