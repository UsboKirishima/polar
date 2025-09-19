<script setup lang="ts">
import ListItem from './ListItem.vue'
import type { Friend, Suggestion } from './ListItem.vue';

const props = defineProps<{
    data: Array<Friend | Suggestion>
    type: 'feed' | 'suggestion' | 'verified'
}>()
</script>

<template>
    <div class="friend-list">
        <ListItem v-for="user in data" :key="user.username" :data="user" :type="type" />
    </div>
</template>

<style scoped>
.friend-list {
    height: 80%;
    overflow-y: auto;
    border-radius: 16px;
}

.friend-list::-webkit-scrollbar {
    transition: 300ms;
    width: 5px;
}

.friend-list::-webkit-scrollbar-thumb {
    background: rgba(48, 36, 53, 0.815);
    border-radius: 4px;
}
</style>
