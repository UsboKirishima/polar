<script setup lang="ts">
import type { Ref } from 'vue';
import List from './List.vue'
import type { Friend, Suggestion } from './ListItem.vue';

const props = defineProps<{
    friends: Friend[];
    suggestions: Suggestion[];
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
            <List :data="suggestions" type="verified" />
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
    z-index: 90;
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
}
</style>
