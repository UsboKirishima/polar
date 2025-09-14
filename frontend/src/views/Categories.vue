<script setup lang="ts">
import CategoryCard from '@/components/categories/CategoryCard.vue';
import PageLoading from '@/components/PageLoading.vue';
import { usePostStore } from '@/stores/posts';
import type { Category } from '@/types';
import { onMounted, ref } from 'vue';
import router from '@/router';
import HeaderBar from '@/components/HeaderBar.vue';

const postStore = usePostStore();
const categories = ref<Category[]>([]);

const handleCategoryOpen = (catId: number) => {
    router.push(`/categories/${catId}`);
}

onMounted(async () => {
    await postStore.fetchAllCategories();
    categories.value = [...postStore.categories, ...postStore.categories, ...postStore.categories].sort((a, b) => b.posts.length - a.posts.length);
})
</script>

<template>
    <PageLoading v-if="postStore.loading" />
    <div v-else class="space">
        <HeaderBar>
            All <b>Categories</b> ({{ categories.length }})
        </HeaderBar>
        <div class="container">
            <div class="categories">
                <CategoryCard v-for="category in categories" :category="category"
                    @click="handleCategoryOpen(category.id)" />
            </div>
        </div>
    </div>
</template>

<style scoped>
.container {
    width: 78%;
    margin: 0 auto;
    padding: 1rem;
}

.categories {
    display: grid;
    grid-template-columns: repeat(auto-fill, 200px);
    gap: 1rem;
}
</style>