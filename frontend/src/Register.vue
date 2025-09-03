<script setup lang="ts">
import api from '@/api';
import { onMounted, ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
const auth = useAuthStore();

const email = ref('');
const username = ref('');
const dayOfBirth = ref(new Date());
const password = ref('');
const confirmPassword = ref('');
const error = ref('');
const isLoading = ref(false);

const handleRegister = async () => {
    error.value = '';

    const success = await auth.register(email.value, password.value);

    if (success) {
        window.location.href = '#/profile'
    } else {
        error.value = 'Failed to register account.'
    }
}

const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
        handleRegister();
    }
};

onMounted(() => {
    if (auth.isLoggedIn) {
        window.location.href = '#/profile'
    }
})
</script>

<template>
    <div class="register-container">
        <form @submit.prevent="handleRegister" class="register-form">
            <h2>Register</h2>

            <div class="form-group">
                <label for="email">Email:</label>
                <input id="email" type="email" v-model="email" @keypress="handleKeyPress" placeholder="Insert email"
                    required :disabled="isLoading" />
            </div>

            <div class="form-group">
                <label for="username">Username:</label>
                <input id="username" type="text" v-model="username" @keypress="handleKeyPress" placeholder="Nickname"
                    required :disabled="isLoading" />
            </div>

            <div class="form-group">
                <label for="password">Password:</label>
                <input id="password" type="password" v-model="password" @keypress="handleKeyPress"
                    placeholder="Create password" required :disabled="isLoading" />
            </div>

            <div class="form-group">
                <label for="cofirm-password">Confirm Password:</label>
                <input id="cofirm-password" type="password" v-model="confirmPassword" @keypress="handleKeyPress"
                    placeholder="Confirm password" required :disabled="isLoading" />
            </div>

            <div v-if="error" class="error-message">
                {{ error }}
            </div>

            <button type="submit" :disabled="isLoading || !email || !password || !confirmPassword || !username"
                class="register-button">
                <span v-if="isLoading">Loading...</span>
                <span v-else>Register</span>
            </button>
        </form>
    </div>
</template>

<style scoped>
.register-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 80vh;
    padding: 20px;
}

.register-form {
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

.register-button {
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
}

.register-button:hover:not(:disabled) {
    background-color: #f0f0f031;
}

.register-button:disabled {
    background-color: #f0f0f007;
    cursor: not-allowed;
}
</style>