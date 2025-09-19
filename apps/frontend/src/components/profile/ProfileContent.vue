<script setup lang="ts">
import type { Post, User } from '@/types';
import type { Friendship } from '@/types/friends';
import { ref } from 'vue';
import FeedPosts from '../feed/FeedPosts.vue';
import FriendsList from '../friends/FriendsList.vue';

const props = defineProps<{
    isProfilePage: boolean;
    user: User | null;
    posts: Post[];
    friends: Friendship[];
}>()

const view = ref<'posts' | 'friends'>('posts');
</script>

<template>
    <div class="container">
        <div class="segmented-control">
            <div @click="view = 'posts'" :class="{ active: view === 'posts' }">
                <p>Posts</p>
            </div>
            <div @click="view = 'friends'" :class="{ active: view === 'friends' }">
                <p>Friends</p>
            </div>
        </div>
        <div v-if="view === 'posts'" class="view">
            <FeedPosts :posts="[...posts.values()]" />
        </div>
        <div v-else-if="view === 'friends'" class="view">
            <FriendsList :current-page="'friends'" :friends="friends" :hide-remove-btn="!isProfilePage" />
        </div>
    </div>
</template>

<style scoped>
.container {
    width: 100%;
    padding: 2rem;
}

.segmented-control {
    display: flex;
    width: 10rem;
    border-radius: 16px;
    background: #a5a6ff13;
    height: 3rem;
    justify-content: center;
    overflow: hidden;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.segmented-control div {
    width: 100%;
    height: 100%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: 300ms;
}

.segmented-control .active {
    transition: 300ms;
    background: rgb(21, 65, 65);
}

.segmented-control div p {
    text-align: center;
}

.view {
    width: 100%;
    margin-top: 1rem;
}
</style>