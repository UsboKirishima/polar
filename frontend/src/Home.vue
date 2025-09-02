<script setup lang="ts">
import OnlineFriends from './components/OnlineFriends.vue';
import UnreadMessages from './components/UnreadMessages.vue';
import NearYou from './components/NearYou.vue';
import TrendingCategories from './components/TrendingCategories.vue';
</script>

<template>
    <main>
        <div class="container">
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
    </main>
</template>

<style scoped>
main {
    height: 100vh;
    padding: 0% 2% 2% 2%;
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
</style>
