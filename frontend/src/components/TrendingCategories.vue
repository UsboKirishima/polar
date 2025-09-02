<script setup lang="ts">
import { ref } from 'vue';

const trendingCategories = ref([
    { name: 'Music', posts: 1240 },
    { name: 'Gaming', posts: 980 },
    { name: 'Sports', posts: 720 },
    { name: 'Movies', posts: 655 },
    { name: 'Fashion', posts: 510 },
    { name: 'Technology', posts: 460 },
    { name: 'Food', posts: 390 },
    { name: 'Travel', posts: 280 },
    { name: 'Art', posts: 860 },
    { name: 'Photography', posts: 745 },
    { name: 'Science', posts: 670 },
    { name: 'Books', posts: 590 },
    { name: 'Health', posts: 530 },
    { name: 'Fitness', posts: 480 },
    { name: 'Education', posts: 440 },
    { name: 'History', posts: 405 },
    { name: 'Nature', posts: 370 },
    { name: 'Politics', posts: 340 },
    { name: 'Economy', posts: 315 },
    { name: 'Memes', posts: 298 },
    // ...
])

function openCategory(name: string) {
    window.open(`#/category/${name.toLowerCase()}`, '_self');
}

</script>

<template>
    <div class="trending_categories">
        <h2>Trending Categories</h2>
        <div class="cats">
            <p v-if="trendingCategories.length == 0" class="no_categories">
                No trending categories right now.
            </p>

            <div v-else class="grid">
                <div class="category" v-for="cat in trendingCategories" :key="cat.name" @click="openCategory(cat.name)">
                    <h3>{{ cat.name }}</h3>
                    <span>{{ cat.posts }} posts</span>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.trending_categories {
    width: 100%;
    padding: 20px;
    height: 380px;
    background-color: #0000002f;
    border-radius: 16px;
    display: flex;
    flex-direction: column;
}

.cats {
    flex: 1;
    overflow-y: auto;
}

.cats::-webkit-scrollbar {
    width: 5px;
    display: block;
    transition: 300ms;
}

.cats::-webkit-scrollbar-thumb {
    background: transparent;
    border-radius: 4px;
}

.cats:hover::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.027);
}

h2 {
    color: #afb6dfcf;
    margin-bottom: 16px;
}

.no_categories {
    color: #afb6dfaf;
    text-align: center;
    margin: 20% 0;
}

.grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 12px;
}

.category {
    background: #f0f0f00a;
    padding: 16px;
    border-radius: 12px;
    text-align: center;
    cursor: pointer;
    transition: background 0.3s ease;
}

.category:hover {
    background: #f0f0f02a;
}

.category h3 {
    margin: 0;
    font-size: 16px;
    color: #fff;
}

.category span {
    display: block;
    margin-top: 8px;
    font-size: 12px;
    color: #afb6dfaf;
}

/* Mobile */
@media (max-width: 600px) {
    .trending_categories {
        height: auto;
        padding: 12px;
    }

    .cats {
        max-height: 60vh;
    }

    .grid {
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
        gap: 8px;
    }

    .category {
        padding: 12px;
    }

    .category h3 {
        font-size: 14px;
    }
}

/* Tablet */
@media (min-width: 601px) and (max-width: 1024px) {
    .trending_categories {
        height: auto;
    }

    .cats {
        max-height: 70vh;
    }

    .grid {
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    }
}
</style>
