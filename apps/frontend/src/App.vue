<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import Navbar from './components/Navbar.vue';
import Sidebar from './components/Sidebar.vue';
import OnlineFriends from './components/OnlineFriends.vue';
import UnreadMessages from './components/UnreadMessages.vue';
import NearYou from './components/NearYou.vue';
import TrendingCategories from './components/TrendingCategories.vue';
import NotFound from './components/NotFound.vue';

import { useAuthStore } from './stores/auth';

import Home from './views/Home.vue';
import Feed from './views/Feed.vue';
import Login from './views/Login.vue';
import Profile from './views/Profile.vue';
import Register from './views/Register.vue';
import ExHome from './views/ExHome.vue';
import Users from './views/Users.vue';
import { useDeviceType } from './composables/useDeviceType';

const routes = {
    '/': ExHome,
    '/feed': Feed,
    '/login': Login,
    '/profile': Profile,
    '/register': Register,
    '/users': Users
}

const auth = useAuthStore();


const { deviceType, isMobile } = useDeviceType();

</script>

<template>
    <div class="container">
        <Sidebar />
        <div class="view">
            <div class="padding"></div>
            <h1 v-if="isMobile">Mobile Website on development</h1>
            <router-view v-else class="page" />
        </div>
    </div>
</template>

<style scoped>
.container {
    width: 100%;
}

.padding {
    width: 100%;
}

.view {
    display: grid;
    grid-template-columns: 14.5% auto;
}
</style>
