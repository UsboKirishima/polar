<script setup lang="ts">
import { onMounted, ref } from 'vue';
import FriendsHeader from '../components/friends/FriendsHeader.vue';
import FriendsList from '../components/friends/FriendsList.vue';
import { useFriendStore } from '../stores/friends';
import { counter } from '@fortawesome/fontawesome-svg-core';
import FriendsSearch from '@/components/friends/FriendsSearch.vue';


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
            <FriendsHeader :currentPage="friendsConfig.page.value" @change-page="setPage"
                :friendsCount="friendStore.friends?.length || 0"
                :requests-count="friendStore.pendingRequests?.length || 0" />
            <FriendsSearch />
            <FriendsList :current-page="friendsConfig.page.value" />
        </div>

    </div>
</template>

<style scoped>
.friends-container {
    width: 90%;
    min-height: 100vh;
    margin: 0 auto;
    color: #ffffffc7;
    z-index: 1000;
}

.friends-space {
    padding: 0 3%;
    z-index: 70;
}
</style>