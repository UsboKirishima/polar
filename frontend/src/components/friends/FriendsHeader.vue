<script setup lang="ts">
const props = defineProps<{
    currentPage: string
}>()

const emits = defineEmits<{
    (e: 'change-page', page: 'friends' | 'requests'): void
}>()
</script>

<template>
    <div class="friend-header">
        <h2>{{ currentPage === 'friends' ? 'Friends' : 'Pending Requests' }}</h2>
        <div class="controls">
            <p :class="{ active_page: currentPage === 'friends' }" @click="emits('change-page', 'friends')">
                Friends
            </p>
            <p :class="{ active_page: currentPage === 'requests' }" @click="emits('change-page', 'requests')">
                Requests
            </p>
        </div>
    </div>
</template>

<style scoped>
.friend-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 20px;
    padding-top: 40px;
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

.friend-header p {
    cursor: pointer;
    font-weight: 600;
    margin: 0;
    transition: color 0.3s;
}

.friend-header p:hover {
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