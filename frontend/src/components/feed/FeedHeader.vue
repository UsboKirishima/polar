<script setup lang="ts">
import { defineEmits, defineProps } from 'vue';

const props = defineProps<{
    currentPage: string
}>()

const emits = defineEmits<{
    (e: 'change-page', page: 'explore' | 'friends'): void
}>()
</script>

<template>
    <div class="feed-header">
        <h2>Feeds</h2>
        <div class="controls">
            <p :class="{ active_page: currentPage === 'explore' }" @click="emits('change-page', 'explore')">
                Explore
            </p>
            <p :class="{ active_page: currentPage === 'friends' }" @click="emits('change-page', 'friends')">
                Friends
            </p>
        </div>
    </div>
</template>

<style scoped>
.feed-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 20px;
    padding-top: 20px;
    position: sticky;
    top: 0;
    background: #14141b;
    height: 3%;
    width: 100%;
}

.controls {
    display: flex;
    gap: 20px;
    z-index: 100;
}

.feed-header p {
    cursor: pointer;
    font-weight: 600;
    margin: 0;
    transition: color 0.3s;
}

.feed-header p:hover {
    color: #fff;
}

h2 {
    color: #fff;
}

.active_page {
    color: #fff;
    border-bottom: 2px solid #fff;
}
</style>