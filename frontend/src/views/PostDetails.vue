<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { usePostStore } from "@/stores/posts";
import { type Post } from "@/types";
import { useAuthStore } from "@/stores/auth";
import PostCard from "@/components/feed/PostCard.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';
import PageLoading from "@/components/PageLoading.vue";

dayjs.extend(relativeTime);

const route = useRoute();
const postStore = usePostStore();
const auth = useAuthStore()
const postId = route.params.id as string;

const post = ref<Post | null>(null);
const newComment = ref("");
const currentUserId = auth.user?.id;

const fetchPost = async () => {
    const data = await postStore.fetchPostById(postId);
    if (data) post.value = data;
};

const toggleLikePost = async () => {
    await postStore.togglePostLike(postId);
    await fetchPost();
};

const submitComment = async () => {
    if (!newComment.value) return;
    await postStore.addPostComment(postId, newComment.value);
    newComment.value = "";
    await fetchPost();
};

const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
        submitComment();
    }
}

const deleteComment = async (commentId: string) => {
    await postStore.removePostComment(postId, commentId);
    await fetchPost();
};

onMounted(fetchPost);
</script>

<template>
    <div class="container" v-if="post">
        <div class="header">
            <router-link to="/feed" class="back-ic">
                <FontAwesomeIcon :icon="faArrowLeft" />
            </router-link>
            <h2>Post by <b>{{ post!.author.profile.fullName }}</b></h2>
        </div>
        <div class="post-detail">
            <PostCard :post="post" />
            <div class="comments">
                <h3>{{ post.comments.length }} comments</h3>
                <div class="comment create">
                    <div class="profile">
                        <img src="/pfp_placeholder.png" alt="">
                    </div>
                    <input type="text" v-model="newComment" @keypress="handleKeyPress" placeholder="Write your reply">
                    <div class="send-btn" @click="submitComment">
                        <FontAwesomeIcon :icon="faArrowRight" />
                    </div>
                </div>
                <div v-for="comment in post!.comments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())"
                    class="comment">
                    <div class="profile">
                        <img src="/pfp_placeholder.png" alt="">
                        <div>
                            <p id="name">Davide Usberti</p>
                            <p id="tag">@usbo</p>
                        </div>
                    </div>
                    <p class="content">{{ comment.text }}</p>
                    <p class="date">{{ dayjs(comment.createdAt).fromNow() }}</p>
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
    align-items: center;
}

.profile img {
    width: 40px;
    border-radius: 100%;
    margin-right: 7px;
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
}

.date {
    font-size: 0.7rem;
    margin-top: 0.5rem;
    color: #ffffff7a;
}

.comments>.comment:last-child {
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


#name {
    font-weight: 700;
    color: #fff;
    font-size: 0.9rem;
}

#tag {
    font-weight: 400;
    color: #ffffff69;
    font-size: 0.8rem;
}

.content {
    font-size: 0.87rem;
    margin-top: 0.5rem;
}
</style>
