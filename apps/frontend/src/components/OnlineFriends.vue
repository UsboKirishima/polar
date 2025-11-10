<script setup lang="ts">
import { ref, useTransitionState } from 'vue'

const onlineFriends = ref([
    { username: 'usbo', avatar: '/pfp_placeholder.png', last_access: 'now' },
    { username: 'aL3x_', avatar: '/pfp_placeholder.png', last_access: 'now' },
    { username: 'camy_b_', avatar: '/pfp_placeholder.png', last_access: 'now' },
    { username: 'bia', avatar: '/pfp_placeholder.png', last_access: 'now' },
    { username: 'lott0', avatar: '/pfp_placeholder.png', last_access: '4h' },
    { username: 'erb3tt4', avatar: '/pfp_placeholder.png', last_access: '4h' },
    { username: 'viscida', avatar: '/pfp_placeholder.png', last_access: '7h' },
    { username: 'usbo', avatar: '/pfp_placeholder.png', last_access: '3h' },
    { username: 'aL3x_', avatar: '/pfp_placeholder.png', last_access: '1h' },
    { username: 'camy_b_', avatar: '/pfp_placeholder.png', last_access: '1h' },
    { username: 'bia', avatar: '/pfp_placeholder.png', last_access: '2h' },
    { username: 'lott0', avatar: '/pfp_placeholder.png', last_access: '4h' },
    { username: 'erb3tt4', avatar: '/pfp_placeholder.png', last_access: '4h' },
    { username: 'viscida', avatar: '/pfp_placeholder.png', last_access: '7h' },
])
</script>

<template>
    <div class="online_friends">
        <h2>Online friends</h2>
        <p v-if="onlineFriends.length == 0" class="no_friends">There are no friends here.</p>
        <ul v-else>
            <li v-for="friend in onlineFriends" :key="friend.username">
                <div class="user_info">
                    <img :src="friend.avatar" alt="" />
                    <a href="#">{{ friend.username }}</a>
                </div>
                <p :class="friend.last_access == 'now' ? 'online' : 'past'">
                    {{ friend.last_access }}
                </p>
            </li>
        </ul>
    </div>
</template>

<style scoped>
.no_friends {
    color: #afb6dfaf;
    text-align: center;
    margin: 20% 0;
}

h2 {
    color: #ffffffc7;
}

@keyframes pulse {
    0% {
        box-shadow: 0 0 0 0 rgba(0, 255, 0, 0.7);
    }

    70% {
        box-shadow: 0 0 0 6px rgba(0, 255, 0, 0);
    }

    100% {
        box-shadow: 0 0 0 0 rgba(0, 255, 0, 0);
    }
}

h2::before {
    content: '';
    display: inline-block;
    width: 16px;
    height: 16px;
    background: #00ff00af;
    border-radius: 50%;
    margin-right: 6px;
    animation: pulse 2s infinite;
    box-shadow: 0 0 0 0 rgba(0, 255, 0, 0.7);
    margin-left: 10px;
}

.online {
    color: #0b0;
}

a {
    text-decoration: none;
}

.past {
    opacity: 80%;
}

img {
    width: 30px;
    border-radius: 100%;
    margin-right: 12px;
}

.online_friends {
    width: 100%;
    padding: 20px;
    height: 380px;
    background-color: #0000002f;
    border-radius: 16px;
    display: flex;
    flex-direction: column;
}

.user_info {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: start;
}

.online_friends ul {
    flex: 1;
    overflow-y: auto;
    list-style: none;
    padding: 4px;
    padding-right: 9px;
    margin: 0;
}

.online_friends ul:hover {
    padding-right: 4px;
}

.online_friends ul::-webkit-scrollbar {
    width: 5px;
    display: none;
    transition: 300ms;
}

.online_friends ul:hover::-webkit-scrollbar {
    transition: 300ms;
    width: 5px;
    display: block;
}

.online_friends ul::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.027);
    border-radius: 4px;
}

.online_friends ul li {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin: 8px 0;
    background: #f0f0f00a;
    padding: 8px;
    border-radius: 12px;
    cursor: pointer;
}

.online_friends ul li:nth-child(odd) {
    background: #f0f0f00f;
}

.online_friends ul li:hover {
    background: #f0f0f02a;
}

@media (max-width: 768px) {
    .online_friends {
        padding: 12px;
        height: auto;
    }

    .online_friends ul {
        max-height: 260px;
    }

    .online_friends ul li {
        flex-direction: column;
        align-items: flex-start;
        gap: 4px;
    }

    .online_friends ul li p {
        align-self: flex-start;
        font-size: 13px;
        margin-left: 43px;
    }
}
</style>
