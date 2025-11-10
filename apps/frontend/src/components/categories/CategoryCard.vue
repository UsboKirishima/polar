<script setup lang="ts">
import type { Category } from '@/types'
import { faHashtag } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { protectedProcedure } from '@polar/api'
import { ref } from 'vue'

const props = defineProps<{
    category: Category
}>()

const categoryName = ref(
    props.category.name.length > 10
        ? props.category.name.slice(0, 10) + '...'
        : props.category.name,
)
</script>

<template>
    <div class="container">
        <p class="name"><FontAwesomeIcon :icon="faHashtag" />{{ categoryName }}</p>
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
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.1);
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
