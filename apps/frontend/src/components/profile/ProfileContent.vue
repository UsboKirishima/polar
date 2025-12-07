<script setup lang="ts">
import type { Post, User, UserComment, UserLike } from '@/types/trpc'
import { ref } from 'vue'
import FeedPosts from '../feed/FeedPosts.vue'
import FriendsList from '../friends/FriendsList.vue'
import PostCard from '../feed/PostCard.vue'
import Userinfo from '../UserInfo.vue'
import type { FriendsType } from '@/views/UserDetails.vue'

defineProps<{
    isProfilePage: boolean
    user: User | null
    posts: Post[]
    likes: UserLike[]
    comments: UserComment[]
    friends: FriendsType;
}>()

const view = ref<'posts' | 'friends' | 'likes' | 'comments'>('posts')
</script>

<template>
    <div class="container">
        <div class="segmented-control">
            <div @click="view = 'posts'" :class="{ active: view === 'posts' }">
                <p>Posts</p>
            </div>
            <div @click="view = 'friends'" :class="{ active: view === 'friends' }">
                <p>Friends</p>
            </div>
            <div @click="view = 'likes'" :class="{ active: view === 'likes' }">
                <p>Likes</p>
            </div>
            <div @click="view = 'comments'" :class="{ active: view === 'comments' }">
                <p>Comments</p>
            </div>
        </div>
        <div v-if="view === 'posts'" class="view">
            <div v-if="!posts.length">
                <p class="nch">No posts here.</p>
            </div>
            <FeedPosts :posts="[...posts.values()]" />
        </div>
        <div v-else-if="view === 'friends'" class="view">
            <div v-if="!friends.length">
                <p class="nch">No friends here.</p>
            </div>
            <FriendsList v-else :current-page="'friends'" :friends="friends" :hide-remove-btn="!isProfilePage" />
        </div>
        <div v-else-if="view === 'likes'" class="view">
            <div v-if="!user?.likes.length">
                <p class="nch">No likes here.</p>
            </div>
            <FeedPosts :posts="[...user?.likes.map((l) => l.post).values()]" />
        </div>
        <div v-else-if="view === 'comments'" class="view">
            <div v-if="!user?.comments.length">
                <p class="nch">No comments here.</p>
            </div>
            <div v-bind:key="comment.id" v-for="comment in user?.comments" class="comments">
                <PostCard :post="comment.post as Post" />
                <div class="comment">
                    <Userinfo :user="user" />
                    <p class="ctext">{{ comment.text }}</p>
                </div>
            </div>
        </div>
        <div v-else>
            <p class="nch">No content here.</p>
        </div>
    </div>
</template>

<style scoped>
.container {
    width: 100%;
    padding: 2rem;
}

.segmented-control {
    display: flex;
    width: 24rem;
    border-radius: 16px;
    background: #a5a6ff13;
    height: 3rem;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.segmented-control div {
    width: 6rem;
    padding: 0 5px;
    height: 100%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: 500ms;
}

.segmented-control .active {
    transition: 300ms;
    background: rgb(21, 65, 65);
}

.segmented-control div p {
    text-align: center;
}

.view {
    width: 100%;
    margin-top: 1rem;
}

.nch {
    margin-top: 3rem;
    margin-left: 3rem;
}

.comments {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
}

.comment {
    padding: 1rem;
    width: 98%;
    background: #7cb5ff3a;
    border-radius: 0 0px 16px 16px;
    margin-bottom: 2rem;
}

.date {
    font-size: 0.7rem;
    margin-top: 0.5rem;
    color: #ffffff7a;
}

.ctext {
    margin-top: 1rem;
}
</style>
