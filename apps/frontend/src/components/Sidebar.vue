<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
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

const auth = useAuthStore()

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
            <li v-for="item in menuItems">
                <router-link :to="item.path" class="box">
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
    margin: 6px 12px;
}

li .box {
    display: flex;
    align-items: center;
    color: #fff;
    font-size: clamp(0.3rem, 1vw + 0.5rem, 1.1rem);
    font-weight: 400;
    text-decoration: none;
    padding: 6px;
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
