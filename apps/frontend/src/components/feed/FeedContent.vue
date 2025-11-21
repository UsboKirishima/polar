<script setup lang="ts">
import type { Post } from '@/types/trpc'
import { computed, onMounted, ref } from 'vue'
import FeedPosts from './FeedPosts.vue'
import { usePostStore } from '@/stores/posts'
import { useFriendStore } from '@/stores/friends'
import PageLoading from '../PageLoading.vue'

const props = defineProps<{
    currentPage: string
    posts: Post[]
}>()

const friendStore = useFriendStore()

const allPosts = computed(() => props.posts)

const friendsPosts = computed(() => {
    const friendIds = new Set(friendStore.friends!.map((friend) => friend.friend.id))
    return allPosts.value.filter((post) => friendIds.has(post.author.id))
})
</script>

<template>
    <div v-if="friendStore.loading" class="loading">
        <PageLoading />
    </div>
    <div v-else class="feed-content">
        <div v-if="currentPage === 'explore'">
            <FeedPosts
                :posts="
                    [...allPosts.values()].sort(
                        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
                    )
                "
                type="explore"
            />
        </div>

        <div v-else>
            <FeedPosts
                :posts="
                    [...friendsPosts.values()].sort(
                        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
                    )
                "
                type="friends"
            />
        </div>
    </div>
</template>

<style scoped></style>
