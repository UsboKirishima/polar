<script setup lang="ts">
import type { User } from '@/types/trpc'
import { ref } from 'vue'
import Username from './Username.vue'
import ProfileFloatCard from './profile/ProfileFloatCard.vue'

const props = defineProps<{
    user: User | null
    disableOver?: boolean
}>()

const profileHover = ref(false)
const mouseX = ref(0)
const mouseY = ref(0)

const handleMouseMove = (event: MouseEvent) => {
    mouseX.value = event.clientX
    mouseY.value = event.clientY
}
</script>

<template>
    <div
        @mouseenter="profileHover = true"
        @mouseleave="profileHover = false"
        @mousemove="handleMouseMove"
    >
        <router-link :to="`/users/${user?.id}`" class="post-header">
            <Transition name="fade-slide" v-if="!disableOver">
                <ProfileFloatCard
                    v-if="profileHover"
                    :user="user!"
                    :mouse-x="mouseX"
                    :mouse-y="mouseY"
                />
            </Transition>
            <img :src="user?.profile?.avatar?.url ?? '/pfp_placeholder.png'" alt="" />
            <div class="h-info">
                <Username
                    :username="user?.profile?.fullName || 'Unknown'"
                    :is-verified="user?.role === 'ADMIN'"
                />
                <p class="place">@{{ user?.profile?.username || 'Unknown' }}</p>
            </div>
        </router-link>
    </div>
</template>

<style scoped>
.post-header {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    text-decoration: none;
    position: relative;
    z-index: 1;
}

.post-header img {
    width: 50px;
    border-radius: 100%;
    aspect-ratio: 1/1;
}

.h-info {
    margin-left: 10px;
}

.h-info .username {
    font-weight: 700;
    color: #fff;
}

.h-info .place {
    font-size: 0.8rem;
    color: #ffffff91;
}
</style>
