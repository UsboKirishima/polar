<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faAdd } from '@fortawesome/free-solid-svg-icons'
import type { User } from '@/types/trpc'
import Username from '../Username.vue'
import { RouterLink } from 'vue-router'

export interface Friend {
    username: string
    avatar: string
    newPostsCount: number
}

export interface Suggestion {
    username: string
    avatar: string
    friendsCount: number
}

const props = defineProps<{
    data: User
    type: 'feed' | 'suggestion' | 'verified'
}>()
</script>

<template>
    <RouterLink :to="`/users/${data.id}`" class="sb-friend">
        <a v-if="type === 'suggestion'" href="#" class="add-friend">
            <FontAwesomeIcon class="icon" :icon="faAdd" />
        </a>
        <img :src="data.profile?.avatar?.url || '/pfp_placeholder.png'" />
        <div class="f-info">
            <p class="username">
                <Username :username="data.profile?.username!" :is-verified="data.role === 'ADMIN'" />
            </p>
            <p class="new-posts">
                {{
                    type === 'feed'
                        ? data.posts.length + ' posts'
                        : data.friends.length + ' friends'
                }}
            </p>
        </div>
    </RouterLink>
</template>

<style scoped>
.sb-friend {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 3px;
    text-decoration: none;
    width: 60rem;
    border-radius: 12px;
    margin: 2px 0;
}

.sb-friend img {
    width: 40px;
    border-radius: 100%;
    object-fit: cover;
}

.f-info {
    margin-left: 13px;
}

.f-info .username {
    display: flex;
    align-items: center;
    color: #fff;
    font-weight: 600;
    font-size: clamp(0.8rem, 0.9vw, 3rem);
}

.f-info .username svg {
    margin-left: 4px;
}

.f-info .new-posts {
    font-size: 0.7rem;
}

.add-friend {
    margin-right: 0.4rem;
    color: #fff;
    background: #a5a6ff13;
    padding: 0.3rem;
    border-radius: 100%;
}
</style>
