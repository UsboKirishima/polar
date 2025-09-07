<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useUserStore } from './stores/users';

const usersStore = useUserStore();

onMounted(async () => {
    usersStore.fetchUsers();
})
</script>

<template>
    <div>
        <ul v-for="user in usersStore.users">
            <li>
                <a :href="'/users/' + user.id">
                    <img src="/pfp_placeholder.png" alt="">
                    <router-link :to="`/users/${user.id}`">{{ user.profile.username }}</router-link>
                </a>
            </li>
        </ul>
    </div>
</template>

<style scoped>
div {
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
}

ul {
    margin: 0 auto;
}

li {
    list-style-type: none;
}

a {
    display: flex;
    flex-direction: row;
    width: 600px;
    margin: 10px 0;
    align-items: center;
}

a img {
    width: 40px;
    margin-right: 10px;
    border-radius: 100%;
}
</style>