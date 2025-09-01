<script setup lang="ts">
import { ref } from 'vue';
import Navbar from './components/Navbar.vue';
import OnlineFriends from './components/OnlineFriends.vue';

</script>

<template>

    <Navbar />
    <main>
        <OnlineFriends />
    </main>
</template>

<style scoped>
main {
    padding: 2%;
}
</style>
