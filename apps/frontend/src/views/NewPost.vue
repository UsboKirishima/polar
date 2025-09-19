<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { usePostStore } from '@/stores/posts';
import type { Category } from '@/types';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { ref } from 'vue';
import { useRouter } from 'vue-router';


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

const postStore = usePostStore();
const router = useRouter();

const postContent = ref('');
const postColor = ref(palettes[0]);

const handleNewPost = async () => {
    //handle categories #

    if (!postContent.value) return;

    const categories: string[] = postContent.value.split(' ').filter(word => word[0] === '#')
    const parsedCategories: { name: string }[] = categories.map(cat => {
        return { name: cat.slice(1) };
    })
    await postStore.createNewPost(postContent.value, parsedCategories);
    postContent.value = '';
    await postStore.fetchAllPosts();
    router.push('/feed');
}

const handleKeyPress = async (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
        await handleNewPost();
    }
}

const goBack = () => {
    router.go(-1);
}

const auth = useAuthStore();
</script>

<template>
    <div class="container">
        <div class="header" @click="goBack">
            <div>
                <FontAwesomeIcon :icon="faArrowLeft" />
            </div>
            <h2>New Post</h2>
        </div>

        <div class="body">
            <div class="create" :style="{ background: `rgba(${postColor.join(',')})` }">
                <div class="profile">
                    <img src="/pfp_placeholder.png" alt="">
                    <div>
                        <p id="fullname">{{ auth.user?.profile.fullName }}</p>
                        <p>@{{ auth.user?.profile.username }}</p>
                    </div>
                </div>
                <div class="send">
                    <input type="text" placeholder="Write a post..." v-model="postContent" @keypress="handleKeyPress">
                    <div @click="handleNewPost">
                        <FontAwesomeIcon :icon="faArrowRight" class="send-btn" />
                    </div>
                </div>
            </div>
            <div class="background-container">
                <h2>Palette</h2>
                <div class="background">
                    <div class="palette" v-for="palette in palettes" @click="postColor = palette"
                        :style="{ background: `rgba(${palette.join(',')})` }">
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.container {
    width: 96%;
}

h2 {
    font-weight: 200;
    margin-left: 10px;
}

.header {
    width: 100%;
    padding: 2rem 1rem;
    position: fixed;
    top: 0;
    backdrop-filter: blur(6px);
    display: flex;
    align-items: center;
    z-index: 90;
    cursor: pointer;
}

.body {
    max-width: 600px;
    margin: 0 auto;
    margin-top: 7rem;
    padding: 20px;
}

.create {
    backdrop-filter: blur(6px);
    padding: 1rem;
    border-radius: 16px;
    margin-bottom: 2rem;
}

.profile {
    display: flex;
    font-size: 0.9rem;
    align-items: center;
    margin-bottom: 1rem;
    color: #ffffff81;
}

.profile img {
    width: 50px;
    border-radius: 100%;
    margin-right: 10px;
}

#fullname {
    font-weight: 700;
    font-size: 1rem;
    color: #fff;
}

.send {
    display: flex;
    align-items: center;
}

.send div {
    cursor: pointer;
    transition: 300ms;
    color: #fff;
}

.send div:hover {
    transition: 300ms;
    color: #ffffff5b;
}

input {
    height: 2rem;
    color: #fff;
    font-size: 1.2rem;
    width: 100%;
    outline: none;
    background: transparent;
    border: none;
}

input::placeholder {
    color: #fffb;
}

.background-container {
    background: #7cb5ff3a;
    padding: 1rem;
    border-radius: 16px;
}

.background {
    margin-top: 1rem;
    display: grid;
    width: 50%;
    grid-template-columns: repeat(auto-fill, minmax(50px, 5px));
    gap: 5px;
}

.palette {
    width: 50px;
    aspect-ratio: 1/1;
    transition: transform 0.2s ease;
    cursor: pointer;
    border-radius: 4px;
    border: 1px solid #fff3;
}

.palette:hover {
    transform: scale(1.05);
}
</style>