<script setup lang="ts">
import { computed, ref } from 'vue';
import Navbar from './components/Navbar.vue';
import OnlineFriends from './components/OnlineFriends.vue';
import UnreadMessages from './components/UnreadMessages.vue';
import NearYou from './components/NearYou.vue';
import TrendingCategories from './components/TrendingCategories.vue';
import NotFound from './components/NotFound.vue';

import Home from './Home.vue';
import Feed from './Feed.vue';


const routes = {
    '/': Home,
    '/feed': Feed
}

const currentPath = ref(window.location.hash)

window.addEventListener('hashchange', () => {
    currentPath.value = window.location.hash
})

const currentView = computed(() => {
    return routes[currentPath.value.slice(1) || '/'] || NotFound
})
</script>

<template>
    <Navbar />
    <component :is="currentView" />
</template>

<style scoped></style>
