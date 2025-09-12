<script setup lang="ts">
import { useUserStore } from '@/stores/users';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const userStore = useUserStore();
const route = useRoute();
const router = useRouter();

const err = ref('');

onMounted(async () => {
    await userStore.fetchUsers();

    if (!route.params.username) {
        err.value = 'url must include the username param: /users/u/:username'
        return;
    }

    const user = userStore.users?.find(user => user.profile.username === route.params.username);
    if (!user) {
        err.value = 'User not found';
        return;
    }

    router.push(`/users/${user.id}`);
})
</script>

<template>
    <div v-if="err">
        <h3>{{ err }}</h3>
    </div>
    <div v-else>
        <h3>Redirecting...</h3>
    </div>
</template>

<style scoped>
h3 {
    text-align: center;
    color: #fff;
    font-weight: 300;
}
</style>