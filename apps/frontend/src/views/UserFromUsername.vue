<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuery } from '@tanstack/vue-query';
import { trpc } from '@/trpc';
import PageLoading from '@/components/PageLoading.vue';

const route = useRoute();
const router = useRouter();
const err = ref('');

const username = route.params.username as string | undefined;

if (!username) {
    err.value = 'URL must include the username param: /users/u/:username';
}

const { data: userFetched, error, isSuccess } = useQuery(
    {
        queryKey: ['getByUsername', username],
        queryFn: () => trpc.user.getByUsername.query(username!),
        enabled: !!username,
    }
);

watch(
    () => isSuccess.value,
    (ready) => {
        if (ready && userFetched.value) {
            router.push(`/users/${userFetched.value.id}`);
        } else if (error.value) {
            err.value = 'User not found';
        }
    }
);
</script>

<template>
    <div v-if="err">
        <h3>{{ err }}</h3>
    </div>
    <div v-else>
        <PageLoading />
    </div>
</template>

<style scoped>
h3 {
    text-align: center;
    color: #fff;
    font-weight: 300;
}
</style>
