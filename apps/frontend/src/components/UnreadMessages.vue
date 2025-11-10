<script setup lang="ts">
import { ref } from 'vue'

const unreadMessages = ref([
    {
        username: 'usbo',
        avatar: '/pfp_placeholder.png',
        last_message: 'hello, how are you doing',
        count: 3,
    },
    {
        username: 'aL3x_',
        avatar: '/pfp_placeholder.png',
        last_message: 'tomorrow I will in London',
        count: 2,
    },
    {
        username: 'camy_b_',
        avatar: '/pfp_placeholder.png',
        last_message: 'I finish work at 7pm',
        count: 1,
    },
    {
        username: 'bia',
        avatar: '/pfp_placeholder.png',
        last_message: 'Why are you so hungry',
        count: 7,
    },
])
</script>

<template>
    <div class="unread_messages">
        <h2>Unread messages</h2>
        <p v-if="unreadMessages.length == 0" class="no_messages">There are no messages here.</p>
        <ul v-else>
            <li v-for="message in unreadMessages" :key="message.username">
                <div class="user_info">
                    <span class="message_count">{{ message.count }}</span>
                    <a href="#">{{ message.username }}</a>
                </div>
                <p class="last_msg">
                    {{ message.last_message.slice(0, 50)
                    }}{{ message.last_message.length > 50 ? '...' : '' }}
                </p>
            </li>
        </ul>
    </div>
</template>

<style scoped>
.no_messages {
    color: #afb6dfaf;
    text-align: center;
    margin: 20% 0;
}

h2 {
    color: #ffffffc7;
}

a {
    text-decoration: none;
}

.message_count {
    background: #ff00007e;
    padding: 3px 7px;
    margin-right: 5px;
    border-radius: 12px;
    font-size: 12px;
}

.unread_messages {
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

.unread_messages ul {
    flex: 1;
    overflow-y: auto;
    list-style: none;
    padding: 4px;
    padding-right: 9px;
}

.unread_messages ul::-webkit-scrollbar {
    width: 5px;
    display: none;
    transition: 300ms;
}

.unread_messages ul:hover::-webkit-scrollbar {
    transition: 300ms;
    width: 5px;
    display: block;
}

.unread_messages ul::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.027);
    border-radius: 4px;
}

.unread_messages ul li {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin: 8px 0;
    background: #f0f0f00a;
    padding: 8px;
    border-radius: 12px;
    cursor: pointer;
    transition: background 0.3s ease;
}

.unread_messages ul li:nth-child(odd) {
    background: #f0f0f00f;
}

.unread_messages ul li:hover {
    background: #f0f0f02a;
}

.last_msg {
    font-size: 14px;
    color: #ffffff4b;
}

/* Mobile */
@media (max-width: 600px) {
    .unread_messages {
        height: auto;
        padding: 12px;
    }

    .unread_messages ul {
        max-height: 60vh;
    }

    .unread_messages ul li {
        flex-direction: column;
        align-items: flex-start;
        height: auto;
    }

    .user_info {
        margin-bottom: 4px;
    }

    .last_msg {
        font-size: 13px;
        color: #ffffff6b;
    }
}

/* Tablet */
@media (min-width: 601px) and (max-width: 1024px) {
    .unread_messages {
        height: auto;
    }

    .unread_messages ul {
        max-height: 70vh;
    }

    .unread_messages ul li {
        height: auto;
        padding: 10px;
    }
}
</style>
