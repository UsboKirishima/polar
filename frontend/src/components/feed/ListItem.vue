<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faAdd } from '@fortawesome/free-solid-svg-icons'

export interface Friend {
    username: string;
    avatar: string;
    newPostsCount: number;
}

export interface Suggestion {
    username: string;
    avatar: string;
    friendsCount: number;
}

function isFriend(data: Friend | Suggestion): data is Friend {
    return (data as Friend).newPostsCount !== undefined
}

const props = defineProps<{
    data: Friend | Suggestion,
    type: 'feed' | 'suggestion'
}>()
</script>

<template>
    <div class="sb-friend">
        <img :src="data.avatar" />
        <div class="f-info">
            <p class="username">{{ data.username }}</p>
            <p class="new-posts">
                {{ isFriend(data) ? data.newPostsCount + ' new posts' :
                    Math.floor(Math.random() * 100) +
                    ' friends' }}
            </p>
        </div>
        <a v-if="type === 'suggestion'" href="#" class="add-friend">
            <FontAwesomeIcon class="icon" :icon="faAdd" />
        </a>
    </div>
</template>

<style scoped>
.sb-friend {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 6px;
    text-decoration: none;
    width: 80%;
}

.sb-friend img {
    width: 40px;
    border-radius: 100%;
}

.f-info {
    margin-left: 13px;
}

.f-info .username {
    color: #ffffffc7;
    font-weight: 600;
}

.f-info .new-posts {
    font-size: 0.8rem;
}

.add-friend {
    margin-left: auto;
    color: #fff;
}
</style>
