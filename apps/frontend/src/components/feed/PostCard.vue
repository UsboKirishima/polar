<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { usePostStore } from '@/stores/posts'
import type { Post } from '@/types'
import {
    faCommentDots,
    faComments,
    faCopy,
    faEllipsisVertical,
    faFileWord,
    faFlag,
    faFlorinSign,
    faHeartBroken,
    faListDots,
    faTrash,
    faHeart as likedIcon,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import Username from '../Username.vue'
import ProfileFloatCard from '../profile/ProfileFloatCard.vue'
import { colorMap, getColorRgba, type ColorEnum } from '@/utils/colors'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { trpc } from '@/trpc'

dayjs.extend(relativeTime)

const props = defineProps<{
    post: Post
}>()

const isPostShowable = ref<boolean>(true);

// -------- Hover Card ---------
const profileHover = ref(false)
const mouseX = ref(0)
const mouseY = ref(0)

// Options menu
const isOptsOpen = ref<boolean>(false);

const handleMouseMove = (event: MouseEvent) => {
    mouseX.value = event.clientX
    mouseY.value = event.clientY
}

const router = useRouter()
const postStore = usePostStore()

const handlePostClick = () => {
    router.push(`/posts/${props.post.id}`)
}

const fetchPost = async () => {
    const data = await postStore.fetchPostById(props.post.id)
    if (data) {
        isPostShowable.value = true;
        postMutable.value = data
    }
}

const postMutable = ref<Post>(props.post)

const authRouter = useAuthStore()
const hasLikesPost = computed(() => {
    return postMutable.value.likes.some((like) => like.userId === authRouter.user?.id)
})

const handlePostLike = async () => {
    await postStore.togglePostLike(props.post.id)
    await fetchPost()
}

const handlePostDelete = async () => {
    await trpc.post.delete.mutate(postMutable.value.id);
    await fetchPost();

    isPostShowable.value = false;
    isOptsOpen.value = false;
}

const handleCopyLink = async () => {
    if (!navigator.clipboard) {
        console.error('The clipboard API is not supported by your browser.');
        alert('The clipboard API is not supported by your browser.');
        return;
    }

    try {
        await navigator.clipboard.writeText(`${window.location.origin}/posts/${postMutable.value.id}`);

        let copySuccess = true;

        setTimeout(() => {
            copySuccess = false;
        }, 2000);

    } catch (err) {
        alert('Failed to copy url address');
    }

    isOptsOpen.value = false;
}

const handleReport = async () => {
    alert('Not yet implmented')
    isOptsOpen.value = false;
}

const closeMenuOnClickOutside = (event: MouseEvent) => {
    const clickedElement = event.target as HTMLElement;

    const postHeader = document.querySelector(`.post-actions`);

    const optionsContainer = clickedElement.closest('.post-header')?.querySelector('.options');

    if (isOptsOpen.value &&
        !clickedElement.closest('.options') &&
        !clickedElement.closest('.actions')) {
        isOptsOpen.value = false;
    }
};

onMounted(() => {
    document.addEventListener('click', closeMenuOnClickOutside);
});

onUnmounted(() => {
    document.removeEventListener('click', closeMenuOnClickOutside);
});
</script>

<template>
    <div class="post-container" v-if="postMutable && isPostShowable" :style="{ background: getColorRgba(post.color as ColorEnum) }">
        <div>
            <div class="post-header">
                <router-link :to="`/users/${post.author.id}`" iv class="user-info" @mouseenter="profileHover = true"
                    @mouseleave="profileHover = false" @mousemove="handleMouseMove">
                    <Transition name="fade-slide">
                        <ProfileFloatCard v-if="profileHover" :user="post.author" :mouse-x="mouseX" :mouse-y="mouseY" />
                    </Transition>
                    <img :src="post.author.profile?.avatar?.url ?? '/pfp_placeholder.png'" alt="" />
                    <div class="h-info">
                        <Username :username="postMutable.author.profile.fullName || 'Unknown'"
                            :is-verified="postMutable.author.role === 'ADMIN'" />
                        <p class="place">@{{ post.author.profile.username || 'Unknown' }}</p>
                    </div>
                </router-link>
                <div class="options" @click="isOptsOpen = !isOptsOpen">
                    <FontAwesomeIcon :icon="faEllipsisVertical" :style="{ color: '#fff' }" class="dots" />
                </div>
                <Transition name="fade-slide">
                    <div v-if="isOptsOpen" class="actions">
                        <ul>
                            <li v-if="post.author.id === authRouter.user?.id" @click="handlePostDelete"
                                class="delete-act">
                                <FontAwesomeIcon :icon="faTrash" /> Delete
                            </li>
                            <li class="report-act" @click="handleReport">
                                <FontAwesomeIcon :icon="faFlag" /> Report
                            </li>
                            <li class="copy-act" @click="handleCopyLink">
                                <FontAwesomeIcon :icon="faCopy" /> Copy link
                            </li>
                        </ul>
                    </div>
                </Transition>
            </div>
        </div>
        <div class="body" @click="handlePostClick">
            <p class="content">
                <template v-for="(word, index) in post.text.split(' ')" :key="index">
                    <a v-if="word.startsWith('#')" :href="`/categories/n/${word.slice(1)}`" class="hashtag">
                        {{ word }}
                    </a>
                    <a v-else-if="word.startsWith('@')" :href="`/users/u/${word.slice(1)}`" class="tags">{{ word }}</a>
                    <span v-else>{{ word }}</span>
                    {{ index !== post.text.split(' ').length - 1 ? ' ' : '' }}
                </template>
            </p>
        </div>
        <div class="controls">
            <div @click="handlePostLike">
                <FontAwesomeIcon :icon="likedIcon" :style="hasLikesPost ? { color: '#ab5382' } : { color: '#fff' }" />
                <p class="count">{{ postMutable.likes.length || 0 }}</p>
            </div>
            <div @click="handlePostClick">
                <FontAwesomeIcon :icon="faCommentDots" />
                <p class="count">{{ postMutable.comments.length || 0 }}</p>
            </div>
            <div>
                <p class="time">{{ dayjs(postMutable.createdAt).fromNow() }}</p>
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
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.user-info {
    display: flex;
    flex-direction: row;
    align-items: center;
    text-decoration: none;
}

.post-header {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    text-decoration: none;
    position: relative;
    z-index: 1;
}

.post-header img {
    width: 50px;
    aspect-ratio: 1/1;
    border-radius: 100%;
}

.dots {
    transition: 200ms;
    z-index: 99;
    cursor: pointer;
}

.dots:hover {
    opacity: 75%;
    transition: 200ms;
}

.actions {
    position: absolute;
    right: 0;
    top: 100%;
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: #2d2d44b7;
    border-radius: 16px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

    list-style: none;
    padding: 5px 0;
    margin: 0;
    min-width: 150px;
    z-index: 1000;
}

.actions ul li {
    display: block;
    padding: 8px 15px;
    text-decoration: none;
    cursor: pointer;
    transition: 200ms;
}

.actions ul li:hover {
    opacity: 75%;
    transition: 200ms;
}

.delete-act {
    color: rgb(255, 45, 45);
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
    display: block;
}

.tags,
.hashtag {
    color: #cfa5ff;
    text-decoration: none;
    display: inline;
}

.tags:hover,
.hashtag:hover {
    text-decoration: underline;
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

.fade-slide-enter-active,
.fade-slide-leave-active {
    transition:
        opacity 0.35s ease,
        transform 0.35s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}

.fade-slide-enter-to,
.fade-slide-leave-from {
    opacity: 1;
    transform: translateY(0);
}

.time {
    font-size: 0.7em;
    color: #ffffff73;
}
</style>
