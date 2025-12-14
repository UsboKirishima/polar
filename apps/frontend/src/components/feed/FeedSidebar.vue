<script setup lang="ts">
import List from './ItemList.vue'
import type { User } from '@/types/trpc'

defineProps<{
    friends: User[]
    suggestions: User[]
    verifiedUsers: User[]
}>()
</script>

<template>
    <div class="feed-sidebar">
        <div class="sb-friends">
            <h2>Friends</h2>
            <List :data="friends" type="feed" />
        </div>

        <div class="sb-friends">
            <h2>Suggestions</h2>
            <List :data="suggestions" type="suggestion" />
        </div>
        <div class="sb-friends">
            <h2>Verified</h2>
            <List :data="verifiedUsers" type="verified" />
        </div>
    </div>
</template>

<style scoped>
.feed-sidebar {
    position: fixed;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
    width: clamp(260px, 17vw, 300px);
    display: flex;
    flex-direction: column;
    padding-top: 1.5rem;
    z-index: 10;
    margin: 0 2rem;
    background-color: #a5a6ff13;
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
}

.sb-friends {
    margin: 3% 10%;
    width: 100%;
    height: 30%;
}

h2 {
    color: #fff;
    margin-bottom: 13px;
    font-size: clamp(0.8rem, 1vw + 0.5rem, 3rem);
}

@media (max-width: 1300px) {
    .feed-sidebar {
        display: none;
    }
}
</style>
