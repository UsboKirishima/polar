<script setup lang="ts">
import type { User } from '@/types/trpc'
import Username from '../UserName.vue'

defineProps<{
    user: User
    mouseX: number
    mouseY: number
}>()
</script>

<template>
    <div class="hover-card" :style="{ top: mouseY + 15 + 'px', left: mouseX + 15 + 'px' }">
        <div class="header">
            <img :src="user.profile?.avatar?.url ?? '/pfp_placeholder.png'" alt="Profile" />
            <div class="profile">
                <Username :username="user.profile?.fullName || 'Unknown'" :is-verified="user.role === 'ADMIN'" />
                <p class="tag">@{{ user.profile?.username }}</p>
            </div>
        </div>
        <p class="bio">
            {{
                user.profile!.bio?.length > 50
                    ? user.profile?.bio.slice(0, 50) + '...'
                    : user.profile?.bio == 'unknown'
                      ? 'no bio yet'
                      : user.profile?.bio
            }}
        </p>
    </div>
</template>

<style scoped>
.hover-card {
    position: fixed;
    background: #1c1c1c88;
    color: #fff;
    padding: 0.8rem;
    border-radius: 10px;
    width: 220px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
    pointer-events: none;
    transition:
        transform 0.2s ease,
        opacity 0.2s ease;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    z-index: 1000;
    backdrop-filter: blur(10px);
}

.header {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
}

.header img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    flex-shrink: 0;
}

.profile {
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.profile .username {
    font-weight: 600;
    font-size: 0.9rem;
}

.tag {
    font-size: 0.8rem;
    color: #ffffff73;
}

.bio {
    font-size: 0.8rem;
    color: #fff;
    line-height: 1.2rem;
}
</style>
