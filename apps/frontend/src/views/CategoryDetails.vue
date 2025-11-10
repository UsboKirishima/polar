<script setup lang="ts">
import FeedPosts from '@/components/feed/FeedPosts.vue'
import HeaderBar from '@/components/HeaderBar.vue'
import PageLoading from '@/components/PageLoading.vue'
import { usePostStore } from '@/stores/posts'
import type { Category } from '@/types'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const category = ref<Category>()
const route = useRoute()
const postStore = usePostStore()
const err = ref('')

onMounted(async () => {
    console.log(route.params.categoryName)
    if (+route.params.categoryId) {
        category.value = await postStore.getCategoryById(+route.params.categoryId)
    } else if (route.params.categoryName) {
        category.value = await postStore.getCategoryByName(`${route.params.categoryName}`)
    } else {
        err.value = 'Failed to fetch category'
    }
})
</script>

<template>
    <div v-if="err">{{ err }}</div>

    <div v-else-if="category?.posts" class="container">
        <HeaderBar>
            <b>{{ category.name[0].toUpperCase() + category.name.slice(1) }}</b> posts
        </HeaderBar>
        <div class="posts">
            <FeedPosts :posts="category.posts" />
        </div>
    </div>

    <PageLoading v-else-if="postStore.loading" />
</template>

<style scoped>
.posts {
    width: 78%;
    margin: 0 auto;
}

b {
    font-weight: 700;
}
</style>
