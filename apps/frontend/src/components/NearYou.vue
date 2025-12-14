<script setup lang="ts">
import { ref } from 'vue'

const nearYouPeople = ref([
    {
        username: 'usbo',
        avatar: '/pfp_placeholder.png',
        distance: '4km',
        status: 'Aperitivo stare in centro a Milano?',
    },
    {
        username: 'aL3x_',
        avatar: '/pfp_placeholder.png',
        distance: '10km',
        status: 'Per chi vuol fare il DJ alla mia festa.',
    },
    {
        username: 'bia',
        avatar: '/pfp_placeholder.png',
        distance: '27km',
        status: 'Ho il cane, chi viene a fare un giro?',
    },
    {
        username: 'camy_b_',
        avatar: '/pfp_placeholder.png',
        distance: '34km',
        status: 'Devo preparare gli esami, qualcuno bravo?',
    },
    {
        username: 'lott0',
        avatar: '/pfp_placeholder.png',
        distance: '35km',
        status: 'Seratina romantica?',
    },
    {
        username: 'erb3tt4',
        avatar: '/pfp_placeholder.png',
        distance: '40km',
        status: 'Qualcuno che vende concerto di Drake?',
    },
    {
        username: 'viscida',
        avatar: '/pfp_placeholder.png',
        distance: '41km',
        status: '',
    },
])
</script>

<template>
    <div class="near_you">
        <h2>Near You</h2>
        <p v-if="nearYouPeople.length == 0" class="no_people">No people found near you.</p>
        <ul v-else>
            <li v-for="user in nearYouPeople" :key="user.username">
                <div class="user_info">
                    <div>
                        <img :src="user.avatar" alt="" />
                        <a href="#">{{ user.username }}</a>
                    </div>
                    <p class="status">
                        {{ user.status.slice(0, 50) || 'No Status'
                        }}{{ user.status.length > 50 ? '...' : '' }}
                    </p>
                </div>
                <div class="details">
                    <p class="distance">{{ user.distance }}</p>
                </div>
            </li>
        </ul>
    </div>
</template>

<style scoped>
.no_people {
    color: #afb6dfaf;
    text-align: center;
    margin: 20% 0;
}

h2 {
    color: #ffffffc7;
}

img {
    width: 30px;
    border-radius: 100%;
    margin-right: 12px;
}

a {
    text-decoration: none;
}

.details {
    display: flex;
    flex-direction: row;
    align-items: center;
}

.distance {
    background: #00ff002f;
    padding: 4px;
    border-radius: 12px;
    font-size: 14px;
    min-width: 40px;
    text-align: center;
}

.status {
    font-size: 14px;
    margin-left: 14px;
    color: #ffffff4b;
}

.near_you {
    width: 100%;
    padding: 20px;
    height: 380px;
    background-color: #0000002f;
    border-radius: 16px;
}

.user_info {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: start;
    width: 100%;
}

.user_info div {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: start;
    width: 30%;
}

.near_you ul {
    height: 340px;
    overflow-y: auto;
    list-style: none;
    padding: 4px;
    padding-right: 9px;
}

.near_you ul:hover {
    padding-right: 4px;
}

.near_you ul::-webkit-scrollbar {
    width: 5px;
    display: none;
    transition: 300ms;
}

.near_you ul:hover::-webkit-scrollbar {
    transition: 300ms;
    width: 5px;
    display: block;
}

.near_you ul::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.027);
    border-radius: 4px;
}

.near_you ul li {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin: 8px auto;
    background: #f0f0f00a;
    padding: 8px;
    border-radius: 12px;
    cursor: pointer;
}

.near_you ul li:nth-child(odd) {
    background: #f0f0f00f;
}

.near_you ul li:hover {
    background: #f0f0f02a;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
    opacity: 1;
}

/* Mobile */
@media (max-width: 600px) {
    .near_you {
        height: auto;
        padding: 12px;
    }

    .near_you ul {
        height: auto;
        max-height: 60vh;
    }

    .user_info {
        flex-direction: column;
        align-items: flex-start;
    }

    .user_info div {
        width: 100%;
        margin-bottom: 6px;
    }

    img {
        width: 30px;
    }

    .status {
        margin-left: 40px;
        font-size: 13px;
    }

    .details {
        align-self: center;
    }
}

/* Tablet */
@media (min-width: 601px) and (max-width: 900px) {
    .near_you {
        height: auto;
    }

    .near_you ul {
        max-height: 70vh;
    }

    img {
        width: 35px;
    }
}
</style>
