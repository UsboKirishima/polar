<script setup lang="ts">
import { ref } from 'vue';


const menuItems = ref([
    { label: 'home', path: '/' },
    { label: 'feed', path: '/' },
    { label: 'near me', path: '/' },
    { label: 'chats', path: '/' },
    { label: 'friends', path: '/' },
    { label: 'categories', path: '/' },
    { label: 'requests', path: '/' },
    { label: 'my profile', path: '/' }
]);

</script>

<template>
    <nav class="desktop_nav">
        <a class="logo" href="/"><img src="/logo_no_bg.png" alt="Polar"></a>
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
}

.desktop_nav>ul {
    display: flex;
    flex-direction: row;
    justify-content: end;
    align-items: center;
}

.desktop_nav>ul>li {
    list-style-type: none;
    margin: 0 12px;
}

.desktop_nav>ul>li>a {}

.logo {
    margin-left: 12px;

}

.logo img {
    width: 60px;
}
</style>