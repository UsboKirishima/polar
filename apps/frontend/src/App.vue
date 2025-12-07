<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Sidebar from './components/SideBar.vue'
import { useLogStore } from './stores/logs';
import { faCheckCircle, faInfo, faMessage } from '@fortawesome/free-solid-svg-icons';
import PageLoading from './components/PageLoading.vue';

import { useAuthStore } from './stores/auth';
import { useFriendStore } from './stores/friends';
import { usePostStore } from './stores/posts';
import { useSettingsStore } from './stores/settings';
import { useUserStore } from './stores/users';

const logStore = useLogStore();

const authStore = useAuthStore();
const friendStore = useFriendStore();
const postStore = usePostStore();
const settingStore = useSettingsStore();
const userStore = useUserStore();
</script>

<template>
    <PageLoading v-if="authStore.loading || friendStore.loading || postStore.loading && !postStore.isLike || settingStore.loading || userStore.loading" />
    <div class="container">
        <Sidebar class="sidebar" />
        <div class="view">
            <div class="padding"></div>
            <router-view class="page" />
        </div>
    </div>
    <Transition name="fade-slide">
        <div v-if="logStore.type" :class="`log-box ${logStore.type}`" @click="logStore.type = null">
            <FontAwesomeIcon class="icon" :icon="logStore.type === 'succ' ?
                faCheckCircle
                : logStore.type === 'err'
                    ? faInfo
                    : faMessage" />
            <p>{{ logStore.type === 'succ'
                ? logStore.success
                : logStore.type === 'err'
                    ? logStore.error
                    : logStore.message }}</p>
        </div>
    </Transition>
</template>

<style scoped>
.container {
    width: 100%;
}

.padding {
    width: 100%;
}

.view {
    display: grid;
    grid-template-columns: 14.5% auto;
}

.log-box {
    position: fixed;
    left: 1rem;
    bottom: 1rem;
    z-index: 99;
    width: 20rem;
    height: 4rem;
    transition: 300ms;

    backdrop-filter: blur(14px) saturate(180%);
    -webkit-backdrop-filter: blur(14px) saturate(180%);
    border-radius: 16px;

    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    font-size: 0.95rem;
    padding: 0.5rem;
}

.log-box:hover {
    transition: 300ms;
    transform: translateX(-0.98rem);
    cursor: pointer;
}

.icon {
    margin-right: 5px;
}

.succ {
    background: linear-gradient(135deg, rgba(173, 255, 190, 0.25), rgba(68, 235, 140, 0.15));
    border: 1px solid rgba(150, 255, 180, 0.4);
    box-shadow: 0 4px 18px rgba(0, 180, 90, 0.25);
}

.err {
    background: linear-gradient(135deg, rgba(255, 140, 140, 0.25), rgba(255, 80, 80, 0.15));
    border: 1px solid rgba(255, 120, 120, 0.4);
    box-shadow: 0 4px 18px rgba(255, 0, 0, 0.3);
}

.msg {
    background: linear-gradient(135deg,
            rgba(220, 240, 255, 0.28),
            rgba(180, 215, 255, 0.18));
    border: 1px solid rgba(200, 230, 255, 0.45);
    box-shadow: 0 4px 18px rgba(150, 190, 255, 0.25);
}

.log-box p {
    text-align: center;
}

@media (max-width: 768px) {
    .padding {
        display: none;
    }

    .container {
        grid-template-columns: 100%;
        min-height: auto;
    }

    .sidebar {
        display: none;
    }

    .view {
        width: 100%;
        padding: 0;
    }
}

.fade-slide-enter-active,
.fade-slide-leave-active {
    transition:
        opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1),
        transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
}

.fade-slide-enter-from,
.fade-slide-leave-to {
    opacity: 0;
    transform: translateY(12px);
}

.fade-slide-enter-to,
.fade-slide-leave-from {
    opacity: 1;
    transform: translateY(0);
}
</style>
