<script setup lang="ts">
import { ref, onMounted, Transition, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePostStore } from '@/stores/posts'
import type { Post, User } from '@/types/trpc'
import { useAuthStore } from '@/stores/auth'
import PostCard from '@/components/feed/PostCard.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
    faArrowLeft,
    faArrowRight,
    faCopy,
    faEllipsisVertical,
    faFlag,
    faTrash,
} from '@fortawesome/free-solid-svg-icons'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import PageLoading from '@/components/PageLoading.vue'
import Userinfo from '@/components/UserInfo.vue'

dayjs.extend(relativeTime)

const route = useRoute()
const postStore = usePostStore()
const router = useRouter()
const auth = useAuthStore()
const postId = route.params.id as string

const isOptsOpen = ref<Record<string, boolean>>({ '': false })

const post = ref<Post | null>(null)
const newComment = ref('')
const currentUserId = auth.user?.id

const fetchPost = async () => {
    const data = await postStore.fetchPostById(postId)
    if (data) post.value = data
}

const toggleLikePost = async () => {
    await postStore.togglePostLike(postId)
    await fetchPost()
}

const submitComment = async () => {
    if (!newComment.value) return
    await postStore.addPostComment(postId, newComment.value)
    newComment.value = ''
    await fetchPost()
}

const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
        submitComment()
    }
}

const deleteComment = async (commentId: string) => {
    await postStore.removePostComment(postId, commentId)
    await fetchPost()
}

const handleReport = async () => {
    alert('Not yet implmented')
    isOptsOpen.value = { '': false }
}

const goBack = () => {
    router.go(-1)
}

const closeMenuOnClickOutside = (event: MouseEvent) => {
    const clickedElement = event.target as HTMLElement

    const postHeader = document.querySelector(`.post-actions`)

    const optionsContainer = clickedElement.closest('.post-header')?.querySelector('.options')

    if (
        isOptsOpen.value &&
        !clickedElement.closest('.options') &&
        !clickedElement.closest('.actions')
    ) {
        isOptsOpen.value = { '': false }
    }
}

onMounted(async () => {
    await fetchPost()
    document.addEventListener('click', closeMenuOnClickOutside)
})

onUnmounted(() => {
    document.removeEventListener('click', closeMenuOnClickOutside)
})
</script>

<template>
    <div class="container" v-if="post">
        <div class="header">
            <div @click="goBack" class="back-ic">
                <FontAwesomeIcon :icon="faArrowLeft" />
            </div>
            <h2>
                Post by <b>{{ post!.author.profile?.fullName }}</b>
            </h2>
        </div>
        <div class="post-detail">
            <PostCard :post="post" />
            <div class="comments">
                <h3>{{ post.comments.length }} comments</h3>
                <div class="comment create">
                    <div class="profile">
                        <img
                            :src="auth.user?.profile?.avatar?.url ?? '/pfp_placeholder.png'"
                            alt=""
                        />
                    </div>
                    <input
                        type="text"
                        v-model="newComment"
                        @keypress="handleKeyPress"
                        placeholder="Post a comment"
                    />
                    <div class="send-btn" @click="submitComment">
                        <FontAwesomeIcon :icon="faArrowRight" />
                    </div>
                </div>
                <div
                    v-for="comment in post!.comments.sort(
                        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
                    )"
                    class="comment"
                >
                    <div class="profile">
                        <Userinfo :user="comment.user as User" disable-over />
                        <div
                            class="options"
                            @click="
                                isOptsOpen[comment.id] === true
                                    ? (isOptsOpen[comment.id] = false)
                                    : (isOptsOpen[comment.id] = true)
                            "
                        >
                            <FontAwesomeIcon
                                :icon="faEllipsisVertical"
                                :style="{ color: '#fff' }"
                                class="dots"
                            />
                        </div>
                        <Transition name="fade-slide">
                            <div v-if="isOptsOpen[comment.id] === true" class="actions">
                                <ul>
                                    <li
                                        v-if="post.author.id === auth.user?.id"
                                        @click="deleteComment(comment.id)"
                                        class="delete-act"
                                    >
                                        <FontAwesomeIcon :icon="faTrash" /> Delete
                                    </li>
                                    <li class="report-act" @click="handleReport">
                                        <FontAwesomeIcon :icon="faFlag" /> Report
                                    </li>
                                </ul>
                            </div>
                        </Transition>
                    </div>
                    <p class="content">{{ comment.text || 'unknown' }}</p>
                    <p class="date">{{ dayjs(comment.createdAt).fromNow() || 'unknown' }}</p>
                </div>
            </div>
        </div>
    </div>

    <div v-else>
        <PageLoading />
    </div>
</template>

<style scoped>
h2 {
    font-weight: 200;
    margin-left: 10px;
}

h3 {
    align-self: flex-start;
    text-align: left;
    margin-top: 3rem;
    margin-bottom: 1rem;
    font-weight: 200;
}

b {
    font-weight: 700;
}

.container {
    width: 96%;
}

.post-detail {
    max-width: 600px;
    padding: 20px;
    margin: 0 auto;
}

.header {
    width: 100%;
    text-align: left;
    background: #14141bb0;
    margin: 0 auto;
    display: flex;
    align-items: center;
    padding: 2rem 1rem;
    position: sticky;
    backdrop-filter: blur(6px);
    top: 0;
    z-index: 90;
}

.post-detail {
    padding: 10px;
    margin-bottom: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.profile {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    position: relative;
    position: relative;
    overflow: visible;
    z-index: 10;
}

.profile img {
    width: 50px;
    border-radius: 100%;
    margin-right: 7px;
    object-fit: cover;
    aspect-ratio: 1/1;
}

.comments {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
}

.comment {
    padding: 1rem;
    width: 98%;
    margin: 0.2rem 0rem;
    background: #7cb5ff3a;
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.date {
    font-size: 0.7rem;
    margin-top: 0.5rem;
    color: #ffffff7a;
}

.comments > .comment:last-child {
    border-radius: 0 0px 16px 16px;
}

.create {
    display: flex;
    border-radius: 16px 16px 0 0;
    align-items: center;
}

.create input {
    width: 100%;
    background-color: transparent;
    outline: none;
    border: none;
    color: #fff;
    font-weight: 500;
    line-height: 2rem;
    font-size: 1rem;
}

.create input::placeholder {
    color: #ffffffcc;
}

.send-btn,
.back-ic {
    cursor: pointer;
    transition: 300ms;
    color: #fff;
}

.send-btn:hover,
.back-ic:hover {
    opacity: 70%;
    transition: 300ms;
}

.content {
    font-size: 0.87rem;
    margin-top: 0.5rem;
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
    z-index: 99;
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
</style>
