<script setup lang="ts">
import { onMounted, ref } from 'vue';
import FriendsHeader from './components/friends/FriendsHeader.vue';
import FriendsList from './components/friends/FriendsList.vue';
import { useFriendStore } from './stores/friends';


const friendsConfig = {
    page: ref<'friends' | 'requests'>('friends')
}

const setPage = (page: 'friends' | 'requests') => {
    friendsConfig.page.value = page;
}

const friendStore = useFriendStore();

onMounted(() => {
    friendStore.fetchFriends();
    friendStore.fetchPendingRequests();
})
</script>

<template>
    <div class="friends-container">
        <div class="friends-space">
            <FriendsHeader :currentPage="friendsConfig.page.value" @change-page="setPage" />
            <FriendsList :current-page="friendsConfig.page.value" />
        </div>

    </div>
</template>

<style scoped>
.friends-container {
    width: 100%;
    min-height: 100vh;
    color: #ffffffc7;
}

.friends-space {
    padding: 0 3%;
    z-index: 70;
}
</style>