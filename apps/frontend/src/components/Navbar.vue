<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()

const menuItems = computed(() => [
    { label: 'home', path: '#/' },
    { label: 'feed', path: '#/feed' },
    { label: 'near me', path: '#/near-me' },
    { label: 'chats', path: '#/chats' },
    { label: 'friends', path: '#/friends' },
    { label: 'categories', path: '#/categories' },
    { label: 'requests', path: '#/requests' },
    {
        label: auth.isLoggedIn ? 'my profile' : 'login',
        path: auth.isLoggedIn ? '#/profile' : '#/login',
    },
])
</script>

<template>
    <nav class="desktop_nav">
        <a href="#/" class="logo"><img src="/polar_no_bg_resized.png" alt="Polar" /></a>
        <ul>
            <li v-for="item in menuItems">
                <a :href="item.path">{{ item.label }}</a>
            </li>
        </ul>
    </nav>
</template>

<style scoped>
.desktop_nav {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    position: sticky;
    top: 0;
    background-color: #14141b;
    z-index: 50;
    padding: 16px;
}

.desktop_nav > ul {
    display: flex;
    flex-direction: row;
    justify-content: end;
    align-items: center;
}

.desktop_nav > ul > li {
    list-style-type: none;
    margin: 0 12px;
}

.logo {
    margin-left: 12px;
}

.logo img {
    width: 120px;
}
</style>
