<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
    faHouse,
    faBomb,
    faLocationDot,
    faComment,
    faUserGroup,
    faList,
    faBell,
    faUser,
    faBars,
    faPlusCircle,
} from '@fortawesome/free-solid-svg-icons'
import { useRoute } from 'vue-router'

const auth = useAuthStore()
const route = useRoute()

const activePage = ref<string | null>(route.path)
const setActivePage = (path: string | null) => {
    console.log(path)
    activePage.value = path
}

const menuItems = computed(() => [
    { icon: faHouse, label: 'home', path: '/' },
    { icon: faBomb, label: 'feed', path: '/feed' },
    { icon: faLocationDot, label: 'near me', path: '/near-me' },
    { icon: faComment, label: 'chats', path: '/chats' },
    { icon: faUserGroup, label: 'friends', path: '/friends' },
    { icon: faList, label: 'categories', path: '/categories' },
    { icon: faBell, label: 'requests', path: '/requests' },
    { icon: faPlusCircle, label: 'create post', path: '/posts/new' },
    {
        icon: faUser,
        label: auth.isLoggedIn ? 'my profile' : 'login',
        path: auth.isLoggedIn ? `/users/${auth.user?.id}` : '/login',
    },
    { icon: faBars, label: 'other', path: '/users' },
])
</script>

<template>
    <nav class="desktop_nav">
        <router-link to="/" class="logo"><img src="/logo_no_bg.png" alt="Polar" /></router-link>
        <ul>
            <li v-bind:key="item.path" v-for="item in menuItems" @click="setActivePage(item.path)">
                <router-link :to="item.path" :class="['box', { active: item.path === activePage }]">
                    <FontAwesomeIcon class="icon" :icon="item.icon" />
                    {{ item.label[0].toUpperCase() + item.label.slice(1) }}
                </router-link>
            </li>
        </ul>
        <p class="copyright">© {{ new Date(Date.now()).getFullYear() }} Polar</p>
    </nav>
</template>

<style scoped>
.desktop_nav {
    display: flex;
    flex-direction: column;
    align-items: start;
    position: fixed;
    top: 0;
    left: 0;
    background-color: #14141b;
    z-index: 50;
    padding: 16px;
    height: 100vh;
    width: 13%;
}

@media (max-width: 768px) {
    .desktop_nav {
        display: none;
    }
}

ul {
    display: flex;
    width: 100%;
    flex-direction: column;
    justify-content: start;
    align-items: start;
    position: relative;
}

li {
    list-style-type: none;
    margin: 4px 12px;
    width: 100%;
}

li .box {
    display: flex;
    align-items: center;
    color: #fff;
    font-size: clamp(0.3rem, 1vw + 0.5rem, 1.1rem);
    font-weight: 400;
    text-decoration: none;
    padding: 10px 6px;
    border-radius: 16px;
}

.box {
    opacity: 65%;
}

.active {
    opacity: 100%;
    transition: 0.4s ease;
}

li .box:hover {
    color: #ffffffc7;
    transition: 300ms;
}

.box .icon {
    margin-right: 8px;
    width: 33px;
}

.logo img {
    width: 120px;
}

.copyright {
    color: #ffffff3f;
    font-size: 0.7rem;
    text-align: center;
    margin: auto auto 0 auto;
    margin-bottom: 10%;
}
</style>
