<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import Navbar from './components/Navbar.vue';
import OnlineFriends from './components/OnlineFriends.vue';
import UnreadMessages from './components/UnreadMessages.vue';
import NearYou from './components/NearYou.vue';
import TrendingCategories from './components/TrendingCategories.vue';
import NotFound from './components/NotFound.vue';

import { useAuthStore } from './stores/auth';

import Home from './Home.vue';
import Feed from './Feed.vue';
import Login from './Login.vue';
import Profile from './Profile.vue';

const routes = {
    '/': Home,
    '/feed': Feed,
    '/login': Login,
    '/profile': Profile
}

const auth = useAuthStore();

const currentPath = ref(window.location.hash)

window.addEventListener('hashchange', () => {
    currentPath.value = window.location.hash
})

const currentView = computed(() => {
    //@ts-ignore
    return routes[currentPath.value.slice(1) || '/'] || NotFound
})


/**
 * This force all the pages (except some) 
 * to redirect page to login.
 */
const isLogged = computed(() => auth.isLoggedIn)

watch(currentPath, (path: string) => {
    const publicRoutes = ['/', '/login', '/register']
    const route = path.slice(1) || '/'

    if (!publicRoutes.includes(route) && !auth.isLoggedIn) {
        window.location.hash = '#/login'
    }
}, { immediate: true }) 
</script>

<template>
    <Navbar />
    <component :is="currentView" />
</template>

<style scoped></style>
