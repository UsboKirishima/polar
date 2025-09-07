<script setup lang="ts">
import api from '@/axiosApi';
import { onMounted, ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
const auth = useAuthStore();

const email = ref('');
const password = ref('');
const error = ref('');
const isLoading = ref(false);

const router = useRouter()

const handleLogin = async () => {
    error.value = '';

    const success = await auth.login(email.value, password.value);

    if (success) {
        router.push(`/profile`)
    } else {
        error.value = 'Invalid email or password.'
    }
}
const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
        handleLogin();
    }
};

onMounted(() => {
    if (auth.isLoggedIn) {
        router.push(`/profile`)
    }
})
</script>

<template>
    <div class="login-container">
        <form @submit.prevent="handleLogin" class="login-form">
            <h2>Login</h2>

            <div class="form-group">
                <label for="email">Email:</label>
                <input id="email" type="email" v-model="email" @keypress="handleKeyPress" placeholder="Insert email"
                    required :disabled="isLoading" />
            </div>

            <div class="form-group">
                <label for="password">Password:</label>
                <input id="password" type="password" v-model="password" @keypress="handleKeyPress"
                    placeholder="Insert password" required :disabled="isLoading" />
            </div>

            <div>
                <a href="#" class="forgot_pwd">Restore password</a>
            </div>

            <div v-if="error" class="error-message">
                {{ error }}
            </div>

            <button type="submit" :disabled="isLoading || !email || !password" class="login-button">
                <span v-if="isLoading">Loading...</span>
                <span v-else>Login</span>
            </button>

            <router-link id="register" to="/register">Create new account</router-link>
        </form>
    </div>
</template>

<style scoped>
.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 80vh;
    padding: 20px;
}

.login-form {
    background: #0000002f;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
}

h2 {
    text-align: center;
    margin-bottom: 1.5rem;
    color: #fff;
}

.form-group {
    margin-bottom: 1rem;
}

.forgot_pwd {
    text-decoration: none;
    margin: 2% 0;
    color: #f5f5f557;
}

label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
}

input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #f0f0f00a;
    border-radius: 4px;
    font-size: 1rem;
    color: inherit;
    box-sizing: border-box;
    background: #f0f0f00a;
}

input:focus {
    outline: none;
    border-color: #f0f0f065;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

input:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
}

.error-message {
    background-color: #66101038;
    color: #c33;
    padding: 0.75rem;
    border-radius: 4px;
    margin-top: 1rem;
}

.login-button {
    width: 100%;
    padding: 0.75rem;
    background-color: #f0f0f018;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    margin-top: 1rem;
    transition: background-color 0.2s;
    margin-bottom: 5px;
}

.login-button:hover:not(:disabled) {
    background-color: #f0f0f031;
}

.login-button:disabled {
    background-color: #f0f0f007;
    cursor: not-allowed;
}

#register {
    font-size: 0.9rem;
    text-decoration: none;
}
</style>