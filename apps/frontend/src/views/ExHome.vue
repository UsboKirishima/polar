<script setup lang="ts">
import OnlineFriends from '../components/OnlineFriends.vue';
import UnreadMessages from '../components/UnreadMessages.vue';
import NearYou from '../components/NearYou.vue';
import TrendingCategories from '../components/TrendingCategories.vue';
import { useAuthStore } from '../stores/auth';

const auth = useAuthStore();
</script>

<template>
    <main>
        <div v-if="auth.isLoggedIn" class="container">
            <div>
                <OnlineFriends />
            </div>
            <div>
                <UnreadMessages />
            </div>
            <div>
                <TrendingCategories />
            </div>
            <div>
                <NearYou />
            </div>
        </div>
        <div v-else class="not-loggedin">
            <div class="header">
                <h1>Polar</h1>
            </div>
        </div>
    </main>
</template>

<style scoped>
main {
    min-height: 100vh;
    padding: 2% 2% 2% 2%;
}

.container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
}

.container>div {
    display: flex;
    position: relative;
}

/* Tablet */
@media (max-width: 900px) {
    .container {
        grid-template-columns: 1fr;
    }
}

/* Desktop largo */
@media (min-width: 1400px) {
    .container {
        grid-template-columns: 1fr 1fr;
    }
}
</style>
