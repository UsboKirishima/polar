<script setup lang="ts">
import { ref } from 'vue';
import api from '../axiosApi';
import { checkAuth } from '../check-auth';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';
import { useFriendStore } from '@/stores/friends';
import { trpc } from '@/trpc';

const router = useRouter();

const id = ref('');
const email = ref('');
const error = ref('');
const isLoading = ref(false);


const auth = useAuthStore();
const friendStore = useFriendStore();

const getUser = async () => {
    isLoading.value = true;
    error.value = '';

    try {
        if (auth.isLoggedIn) {
            id.value = auth.user!.id;
            email.value = auth.user!.email;
        }

    } catch (err: any) {
        error.value = err.response?.data?.message || 'Error';
    } finally {
        isLoading.value = false;
    }
};

getUser();

const logout = () => {
    auth.logout();
    router.push('/login')
}

</script>

<template>
    <div v-if="auth.isLoggedIn" class="profile-container">
        <div class="profile-card">
            <div class="profile-image">
                <img src="/pfp_placeholder.png" alt="Profile pic">
                <div class="stats">
                    <p>Posts: 22</p>
                    <p>Friends: {{ friendStore.friends?.length || 0 }}</p>
                    <p>Likes: 13k</p>
                </div>
            </div>
            <div class="profile-info">
                <p class="username">{{ auth.user?.profile.username }}</p>
                <p><b>full name:</b> {{ auth.user?.profile.fullName }}</p>
                <p><b>email:</b> {{ email }} </p>
                <p><b>day of birth:</b> {{ auth.user?.profile.dateOfBirth }}</p>
                <p><b>id:</b> {{ id }}</p>
            </div>
            <div class="controls">
                <button id="edit">Edit</button>
                <button id="share">Share</button>
                <button id="settings">Settings</button>
                <button @click="logout" id="logout">Logout</button>
            </div>
        </div>
    </div>
    <div v-else class="err">
        <img src="/logo_no_bg.png" alt="Polar">
        <h1>Error <b>401</b></h1>
        <p>Sorry but you need to <router-link to="/login">login</router-link> to view this page.</p>
    </div>
</template>

<style scoped>
.err {
    text-align: center;
}

.err h1 b {
    color: rgba(255, 0, 0, 0.644);
}

.err h1 {
    margin-bottom: 30px;
}

.profile-container {
    min-height: 100vh;
    padding: 2% 2% 2% 2%;
}

.profile-card {
    background: #0000002f;
    padding: 2%;
    width: 45%;
    border-radius: 16px;
    display: flex;
    flex-direction: row;
    height: 250px;
}

.profile-image {
    width: 20%;
    height: 500px;
    display: flex;
    flex-direction: column;
    margin: 0 2%;
}

.profile-image img {
    width: 100%;
    border-radius: 16px;
}

.stats {
    padding: 10% 0 0 5%;
}

.stats p {
    font-size: 0.8rem;
    color: #f1f1f1c9;
}

.profile-info p b {
    color: #f1f1f1be;
}

.profile-info .username {
    color: #f1f1f1;
    font-weight: 700;
    font-size: 1.2rem;
    margin-bottom: 5%;
}

.profile-info p {
    font-size: 0.9rem;
    margin: 2% 0;
}

.controls {
    margin-left: auto;
    height: 35%;
}

.controls button {
    display: block;
    width: 100%;
    padding: 7px 17px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    background: #31313180;
    color: #fff;
    font-weight: 600;
    margin: 5px 0;
}

#logout {
    background: rgba(255, 0, 0, 0.397);
}

#share {
    background: rgba(0, 255, 0, 0.26);
}

#settings {
    background: rgba(110, 110, 255, 0.171);
}

.controls button:hover {
    opacity: 75%;
}
</style>