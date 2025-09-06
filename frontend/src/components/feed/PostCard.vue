<script setup lang="ts">
import type { Post } from '@/Feed.vue';
import { faCommentDots, faComments, faHeart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const props = defineProps<{
    post: Post;
}>();

const palettes = [
    [45, 75, 130, 255],   // Deep blue
    [130, 45, 75, 255],   // Dark magenta
    [75, 130, 45, 255],   // Dark olive green
    [130, 100, 45, 255],  // Brownish
    [75, 45, 130, 255],   // Deep purple
    [45, 130, 100, 255],  // Teal-ish
    [100, 45, 130, 255],  // Indigo
    [130, 75, 45, 255],   // Rust
    [60, 90, 150, 255],   // Muted blue
    [150, 60, 90, 255],   // Muted pink
    [60, 150, 90, 255],   // Muted green
    [150, 90, 60, 255],   // Burnt orange
    [90, 60, 150, 255],   // Dark violet
    [90, 150, 60, 255],   // Dark lime green
    [120, 60, 120, 255],  // Dark rose
];



const randomColor = () => {
    const [r, g, b, a] = palettes[Math.floor(Math.random() * palettes.length)];
    // Convert alpha from 0-255 to 0-1
    return `background: rgba(${r}, ${g}, ${b}, ${a / 255});`
}
</script>

<template>
    <div class="post-container" :style="randomColor()">
        <div class="post-header">
            <img :src="post.author.avatar" alt="">
            <div class="h-info">
                <p class="username">{{ post.author.username }}</p>
                <p class="place">{{ post.author.place }}</p>
            </div>
        </div>
        <div class="body">
            <p class="content">{{ post.text }}</p>
        </div>
        <div class="controls">
            <div>
                <FontAwesomeIcon :icon="faHeart" />
                <p class="count">{{ post.likes }}</p>
            </div>
            <div>
                <FontAwesomeIcon :icon="faCommentDots" />
                <p class="count">{{ post.comments.length }}</p>
            </div>
        </div>
    </div>
</template>

<style scoped>
.post-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    margin: 5px 0;
    border-radius: 16px;
    padding: 2%;
}

.post-header {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
}

.post-header img {
    width: 50px;
    border-radius: 100%;
}

.h-info {
    margin-left: 10px;
}

.h-info .username {
    font-weight: 700;
    color: #fff;
}

.h-info .place {
    font-size: 0.8rem;
    color: #ffffff91;
}

.body {
    margin-top: 24px;
}

.content {
    color: white;
}

.controls {
    display: flex;
    margin-top: 20px;
    color: #fff;
}

.controls div {
    display: flex;
    margin-right: 10px;
    align-items: center;
}

.controls div .count {
    margin-left: 5px;
    font-weight: 200;
    font-size: 0.8rem;
}
</style>