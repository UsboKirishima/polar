<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { usePostStore } from '@/stores/posts';
import type { Post } from '@/types';
import { faCommentDots, faComments, faHeartBroken, faHeart as likedIcon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';


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

const router = useRouter();
const postStore = usePostStore();

const handlePostClick = () => {
    router.push(`/posts/${props.post.id}`);
}

const fetchPost = async () => {
    const data = await postStore.fetchPostById(props.post.id);
    if (data) postMutable.value = data;
};


const postMutable = ref<Post>(props.post);

const authRouter = useAuthStore();
const hasLikesPost = computed(() => {
    return postMutable.value.likes.some(like => like.userId === authRouter.user?.id);
});

const handlePostLike = async () => {
    await postStore.togglePostLike(props.post.id);
    await fetchPost()
};

</script>

<template>
    <div class="post-container" :style="randomColor()">
        <div class="post-header">
            <img src="/pfp_placeholder.png" alt="">
            <div class="h-info">
                <p class="username">{{ postMutable.author.profile.fullName || 'Unknown' }}</p>
                <p class="place">@{{ post.author.profile.username || 'Unknown' }}</p>
            </div>
        </div>
        <div class="body" @click="handlePostClick">
            <p class="content">{{ postMutable.text || 'Unknown' }}</p>
        </div>
        <div class="controls">
            <div @click="handlePostLike">
                <FontAwesomeIcon :icon="likedIcon" :style="hasLikesPost ? { color: '#ab5382' } : { color: '#fff' }" />
                <p class="count">{{ postMutable.likes.length || 0 }}</p>
            </div>
            <div>
                <FontAwesomeIcon :icon="faCommentDots" />
                <p class="count">{{ postMutable.comments.length || 0 }}</p>
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
    cursor: pointer;
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
    cursor: pointer;
}

.controls div .count {
    margin-left: 5px;
    font-weight: 200;
    font-size: 0.8rem;
}
</style>