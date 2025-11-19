<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query';
import { trpc } from '@/trpc';
import PageLoading from '@/components/PageLoading.vue';

const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: () => trpc.user.getAll.query(),
    enabled: true
});

</script>

<template>
    <PageLoading v-if="isLoading" />
    <div v-else>
        <ul v-for="user in users">
            <li>
                <a :href="'/users/' + user.id">
                    <img src="/pfp_placeholder.png" alt="" />
                    <router-link :to="`/users/${user.id}`">{{ user.profile?.username }}</router-link>
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
