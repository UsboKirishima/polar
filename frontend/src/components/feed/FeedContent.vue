<script setup lang="ts">
const props = defineProps<{
    currentPage: string
}>()
</script>

<template>
    <div class="feed-content">
        <div v-if="currentPage === 'explore'">
            <h3>Explore Feed</h3>
            <p>General contents here...</p>
        </div>

        <div v-else>
            <h3>Friends Feed</h3>
            <p>Friends-only contents here...</p>
        </div>
    </div>
</template>

<style scoped>
.feed-content {
    margin-top: 20px;
}
</style>
