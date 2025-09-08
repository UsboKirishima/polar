<template>
    <div class="container" v-if="post">
        <h1>Post Detail</h1>

        <!-- Post info -->
        <div class="post-detail">
            <p>
                <strong>{{ post.author.profile?.username || post.author.email }}</strong>
                <span class="date">({{ new Date(post.createdAt).toLocaleString() }})</span>
            </p>
            <p>{{ post.text }}</p>
            <p>Categories: {{post.categories.map(c => c.name).join(", ")}}</p>
            <p>
                Likes: {{ post.likes.length }}
                <button @click="toggleLikePost">👍 Like/Unlike</button>
            </p>
        </div>

        <hr />

    </div>

    <div v-else>
        <p>Loading post...</p>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { usePostStore } from "@/stores/posts";
import { type Post } from "@/types";
import { useAuthStore } from "@/stores/auth";

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

const deleteComment = async (commentId: string) => {
    await postStore.removePostComment(postId, commentId);
    await fetchPost();
};

onMounted(fetchPost);
</script>

<style scoped>
.container {
    max-width: 600px;
    margin: auto;
    padding: 20px;
}

.post-detail {
    border: 1px solid #ccc;
    padding: 10px;
    margin-bottom: 10px;
}

.comments {
    margin-top: 20px;
}

.comment {
    border-top: 1px solid #eee;
    padding: 5px 0;
}

.add-comment input {
    margin-right: 10px;
    width: 70%;
}

.date {
    font-size: 0.8em;
    color: gray;
}
</style>
