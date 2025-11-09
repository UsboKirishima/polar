<script setup lang="ts">
import type { Post } from '@/types';
import PostCard from './PostCard.vue';
const props = defineProps<{
    posts: Array<Post>;
}>();

</script>

<template>
    <div v-for="post in posts">
        <PostCard :post="post" class="post" />
    </div>
</template>


<style scoped>
div {
    display: flex;
    flex-direction: row;
    width: 90%;
    margin: 0 auto;
}


@media (max-width: 768px) {
    div {
        width: 90%;
        margin: 0 auto;
    }
}
</style>