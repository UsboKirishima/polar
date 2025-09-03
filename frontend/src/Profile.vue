<script setup lang="ts">
import { ref } from 'vue';
import api from './api';
import { checkAuth } from './check-auth';
import { useAuthStore } from './stores/auth';

const id = ref('');
const email = ref('');
const error = ref('');
const isLoading = ref(false);


const auth = useAuthStore();

const getUser = async () => {
    isLoading.value = true;
    error.value = '';

    try {
        if (auth.isLoggedIn) {
            id.value = auth.user!.id;
            email.value = auth.user!.email;
        }

    } catch (err: any) {
        error.value = err.response?.data?.message || 'Error';
    } finally {
        isLoading.value = false;
    }
};

getUser();

</script>

<template>
    <div v-if="auth.isLoggedIn">
        <h1> id: {{ id }}</h1>
        <h2> email: {{ email }} </h2>
        <button @click="auth.logout">Logout</button>
    </div>
    <div v-else>
        <h1>No logged in</h1>
    </div>
</template>