<template>
    <div class="p-4">
        <h1 class="text-2xl font-bold">User details</h1>
        <p v-if="loading">Loading...</p>
        <div v-else>
            <p><strong>ID:</strong> {{ user.id }}</p>
            <p><strong>Email:</strong> {{ user.email }}</p>
            <p><strong>Faull name:</strong> {{ user.profile.fullName }}</p>
            <p><strong>Username:</strong> {{ user.profile.username }}</p>
            <p><strong>Data di nascita:</strong> {{ formatDate(user.profile.dateOfBirth) }}</p>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '../axiosApi'

const route = useRoute()
const user = ref(null)
const loading = ref(true)

const formatDate = (date) => {
    return new Date(date).toLocaleDateString()
}

onMounted(async () => {
    try {
        const res = await api.get(`/users/${route.params.id}`)
        user.value = res.data
    } catch (error) {
        console.error('Errore nel recupero utente:', error)
    } finally {
        loading.value = false
    }
})
</script>
