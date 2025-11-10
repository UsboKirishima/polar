<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
    faHouse,
    faBomb,
    faComment,
    faUser,
    faPlusCircle,
} from '@fortawesome/free-solid-svg-icons'

const route = useRoute()
const auth = useAuthStore()

const navItems = computed(() => [
    {
        icon: faHouse,
        label: 'Home',
        path: '/',
        isActive: route.path === '/',
    },
    {
        icon: faBomb,
        label: 'Feed',
        path: '/feed',
        isActive: route.path === '/feed',
    },
    {
        icon: faPlusCircle,
        label: 'Post',
        path: '/posts/new',
        isActive: route.path === '/posts/new',
    },
    {
        icon: faComment,
        label: 'Chat',
        path: '/chats',
        isActive: route.path.startsWith('/chats'),
    },
    {
        icon: faUser,
        label: auth.isLoggedIn ? 'Profile' : 'Login',
        path: auth.isLoggedIn ? `/users/${auth.user?.id}` : '/login',
        isActive: auth.isLoggedIn
            ? route.path === `/users/${auth.user?.id}`
            : route.path === '/login',
    },
])
</script>

<template>
    <nav class="bottom-nav">
        <router-link
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="nav-item"
            :class="{ 'nav-item--active': item.isActive }"
        >
            <FontAwesomeIcon :icon="item.icon" class="nav-icon" />
            <span class="nav-label">{{ item.label }}</span>
        </router-link>
    </nav>
</template>

<style scoped>
.bottom-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: var(--bg-secondary);
    backdrop-filter: blur(10px);
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: var(--space-xs) var(--space-sm);
    z-index: 1000;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.3);
}

.nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: var(--space-xs);
    text-decoration: none;
    color: var(--text-tertiary);
    transition: all 0.3s ease;
    border-radius: var(--radius-sm);
    min-width: clamp(50px, 15vw, 70px);
    position: relative;
}

.nav-item:hover {
    color: var(--text-secondary);
    background: var(--bg-hover);
}

.nav-item--active {
    color: var(--accent-primary);
}

.nav-item--active::before {
    content: '';
    position: absolute;
    top: -2px;
    left: 50%;
    transform: translateX(-50%);
    width: clamp(20px, 8vw, 30px);
    height: 3px;
    background: var(--accent-primary);
    border-radius: 0 0 var(--radius-sm) var(--radius-sm);
}

.nav-icon {
    font-size: clamp(18px, 4vw, 20px);
    margin-bottom: var(--space-xs);
}

.nav-label {
    font-size: var(--text-xs);
    font-weight: 500;
    text-align: center;
    line-height: 1;
}

/* Animazione per feedback tattile */
.nav-item:active {
    transform: scale(0.95);
}

/* Nasconde su desktop e tablet */
@media (min-width: 768px) {
    .bottom-nav {
        display: none;
    }
}

/* Aggiusta il padding bottom del body quando è presente */
body:has(.bottom-nav) {
    padding-bottom: clamp(70px, 18vw, 90px);
}
</style>
