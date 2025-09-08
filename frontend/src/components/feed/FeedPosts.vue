<script setup lang="ts">
import type { Post } from '@/views/Feed.vue';
import PostCard from './PostCard.vue';
const props = defineProps<{
    posts: Array<Post>;
    type: 'explore' | 'friends';
}>();

</script>

<template>
    <div v-for="post in posts">
        <PostCard :post="post" />
    </div>
</template>


<style scoped>
div {
    display: flex;
    flex-direction: row;
    width: 100%;
}
</style>