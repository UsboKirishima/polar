<script setup lang="ts">
import type { Category } from '@/types';
import { faHashtag } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const props = defineProps<{
    category: Category;
}>();

</script>

<template>
    <div class="container">
        <p class="name">
            <FontAwesomeIcon :icon="faHashtag" />{{ category.name }}
        </p>
        <p>{{ category.posts.length }} posts</p>
    </div>
</template>

<style scoped>
.container {
    background-color: #a5a6ff13;
    backdrop-filter: blur(6px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    transition: 200ms;
    cursor: pointer;
    height: 4rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    border-radius: 16px;
}

.container:hover {
    transform: translateY(-6px);
    transition: 200ms;
    box-shadow: 0 4px 8px rgba(63, 63, 63, 0.15);
}

.name {
    color: #fff;
    font-weight: 700;
    font-size: 1.1em;
    display: flex;
    justify-items: center;
    justify-content: center;
    margin-bottom: 1rem;
}

p {
    text-align: center;
    color: #ffffff69;
    font-size: 0.8rem;
}
</style>