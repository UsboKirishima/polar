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
    { name: 'DIY', posts: 276 },
    { name: 'Parenting', posts: 250 },
    { name: 'Pets', posts: 230 },
    { name: 'Anime', posts: 210 },
    { name: 'Comics', posts: 195 },
    { name: 'Cars', posts: 180 },
    { name: 'Motorcycles', posts: 170 },
    { name: 'Coding', posts: 160 },
    { name: 'Cybersecurity', posts: 150 },
    { name: 'AI & ML', posts: 145 },
    { name: 'UX/UI Design', posts: 132 },
    { name: 'Startup', posts: 125 },
    { name: 'Marketing', posts: 118 },
    { name: 'Business', posts: 110 },
    { name: 'Philosophy', posts: 102 },
    { name: 'Psychology', posts: 98 },
    { name: 'Languages', posts: 90 },
    { name: 'Geography', posts: 85 },
    { name: 'Astronomy', posts: 80 },
    { name: 'Space Exploration', posts: 78 },
    { name: 'Blockchain', posts: 75 },
    { name: 'NFTs', posts: 72 },
    { name: 'Investing', posts: 70 },
    { name: 'Stocks', posts: 68 },
    { name: 'Crypto', posts: 65 },
    { name: 'Cooking', posts: 60 },
    { name: 'Baking', posts: 58 },
    { name: 'Street Food', posts: 55 },
    { name: 'Luxury', posts: 52 },
    { name: 'Minimalism', posts: 50 },
    { name: 'Tattoo Art', posts: 48 },
    { name: 'Streetwear', posts: 45 },
    { name: 'Sneakers', posts: 42 },
    { name: 'Photography Gear', posts: 40 },
    { name: 'Watches', posts: 38 },
    { name: 'Jewelry', posts: 35 },
    { name: 'Interior Design', posts: 33 },
    { name: 'Architecture', posts: 30 },
    { name: 'Gardening', posts: 28 },
    { name: 'Wildlife', posts: 26 },
    { name: 'Marine Life', posts: 24 },
    { name: 'Board Games', posts: 22 },
    { name: 'Card Games', posts: 20 },
    { name: 'Esports', posts: 18 },
    { name: 'VR & AR', posts: 16 },
    { name: 'Smartphones', posts: 15 },
    { name: 'Laptops', posts: 14 },
    { name: 'PC Building', posts: 13 },
    { name: 'Retro Gaming', posts: 12 },
    { name: 'Hiking', posts: 11 },
    { name: 'Camping', posts: 10 },
    { name: 'Surfing', posts: 9 },
    { name: 'Skateboarding', posts: 8 },
    { name: 'Snowboarding', posts: 7 },
    { name: 'Martial Arts', posts: 6 },
    { name: 'Dance', posts: 5 },
    { name: 'Theatre', posts: 4 },
    { name: 'Opera', posts: 3 },
    { name: 'Classical Music', posts: 2 },
    { name: 'Poetry', posts: 1 },
])

</script>

<template>
    <div class="trending_categories">
        <h2>Trending Categories</h2>
        <div class="cats">
            <p v-if="trendingCategories.length == 0" class="no_categories">
                No trending categories right now.
            </p>

            <div v-else class="grid">
                <div class="category" v-for="cat in trendingCategories" :key="cat.name">
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
}

.trending_categories:hover {
    padding-right: 4px;
}

.cats {
    overflow-y: auto;
    height: 330px;
}

.cats::-webkit-scrollbar {
    width: 5px;
    display: none;
    transition: 300ms;
}

.cats:hover::-webkit-scrollbar {
    transition: 300ms;
    width: 5px;
    display: block;
}

.cats::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.027);
    border-radius: 4px;
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
    width: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fill, 142px);
    gap: auto;
}

.category {
    background: #f0f0f00a;
    padding: 16px;
    margin: 4px;
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
</style>