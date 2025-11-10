<script setup lang="ts">
import { usePostStore } from '@/stores/posts'
import { onMounted } from 'vue'

const postStore = usePostStore()

onMounted(async () => {
    await postStore.fetchAllPosts()
})
</script>

<template>
    <ul>
        <li v-for="post in postStore.posts">
            <p>{{ post.author.profile.username }}</p>
            <p>{{ post.id }}</p>
            <p>{{ post.text }}</p>
        </li>
    </ul>
</template>

<style scoped>
ul {
    margin: auto;
}
</style>
