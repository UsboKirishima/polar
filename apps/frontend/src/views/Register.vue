<script setup lang="ts">
import api from '@/axiosApi';
import { onMounted, ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const auth = useAuthStore();
const router = useRouter()

const email = ref('');
const username = ref('');
const dayOfBirth = ref('');
const password = ref('');
const fullname = ref('');
const confirmPassword = ref('');
const error = ref('');
const isLoading = ref(false);

const handleRegister = async () => {
    error.value = '';

    if (password.value !== confirmPassword.value) {
        error.value = 'Passwords do not match.';
        return;
    }

    const dob = dayOfBirth.value ? new Date(dayOfBirth.value) : new Date();

    const success = await auth.register(email.value, password.value, username.value, dob, fullname.value);

    if (success) {
        router.push(`/users/${auth.user?.id}`)
    } else {
        error.value = 'Failed to register account. Please check the information provided.';
    }
}

const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
        handleRegister();
    }
};

onMounted(() => {
    if (auth.isLoggedIn) {
        router.push(`/feed`)
    }
})
</script>

<template>
    <div class="register-container">
        <form @submit.prevent="handleRegister" class="register-form">
            <h2>Create an Account</h2>

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
                <label for="fullname">Full Name:</label>
                <input id="fullname" type="text" v-model="fullname" @keypress="handleKeyPress"
                    placeholder="Your Full Name" required :disabled="isLoading" />
            </div>

            <div class="form-group">
                <label for="dayOfBirth">Date of birth:</label>
                <input id="dayOfBirth" type="date" v-model="dayOfBirth" @keypress="handleKeyPress"
                    placeholder="Date of birth" required :disabled="isLoading" />
            </div>

            <div class="form-group">
                <label for="password">Password:</label>
                <input id="password" type="password" v-model="password" @keypress="handleKeyPress"
                    placeholder="Create password" required :disabled="isLoading" />
            </div>

            <div class="form-group">
                <label for="confirm-password">Confirm Password:</label>
                <input id="confirm-password" type="password" v-model="confirmPassword" @keypress="handleKeyPress"
                    placeholder="Confirm password" required :disabled="isLoading" />
            </div>

            <div v-if="error" class="error-message">
                {{ error }}
            </div>

            <button type="submit"
                :disabled="isLoading || !email || !password || !confirmPassword || !username || !fullname || !dayOfBirth || password !== confirmPassword"
                class="register-button">
                <span v-if="isLoading">Loading...</span>
                <span v-else>Register</span>
            </button>

            <router-link id="login" to="/login">Already have an account? Login</router-link>
        </form>
    </div>
</template>

<style scoped>
.register-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 20px;
    box-sizing: border-box;
}

.register-form {
    width: 90%;
    max-width: 450px;
    background: #0000002f;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    padding: 2.5rem;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.1);
}

h2 {
    text-align: center;
    margin-bottom: 2rem;
    color: #fff;
    font-size: 1.8rem;
}

.form-group {
    margin-bottom: 1.25rem;
}

label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #f0f0f0;
}

input {
    width: 100%;
    padding: 0.9rem 1rem;
    border: 1px solid #ffffff1a;
    border-radius: 6px;
    font-size: 1rem;
    color: #fff;
    box-sizing: border-box;
    background: #ffffff0a;
    transition: border-color 0.2s, background-color 0.2s;
}

input[type="date"] {
    color-scheme: dark;
}

input:focus {
    outline: none;
    border-color: #61afef;
    background: #ffffff12;
}

input:disabled {
    background-color: #333;
    cursor: not-allowed;
    color: #aaa;
}

.error-message {
    background-color: #ff000030;
    color: #ff6666;
    padding: 1rem;
    border-radius: 6px;
    margin-top: 1.5rem;
    text-align: center;
}

.register-button {
    width: 100%;
    padding: 1rem;
    background-color: #61afef;
    color: #1a1a1a;
    border: none;
    border-radius: 6px;
    font-size: 1.1rem;
    font-weight: bold;
    cursor: pointer;
    margin-top: 2rem;
    transition: background-color 0.2s, box-shadow 0.2s;
    margin-bottom: 15px;
    box-shadow: 0 2px 10px rgba(97, 175, 239, 0.4);
}

.register-button:hover:not(:disabled) {
    background-color: #79c0ff;
    box-shadow: 0 4px 15px rgba(97, 175, 239, 0.6);
}

.register-button:disabled {
    background-color: #444;
    color: #777;
    cursor: not-allowed;
    box-shadow: none;
}

#login {
    display: block;
    text-align: center;
    font-size: 0.9rem;
    color: #61afef;
    text-decoration: none;
    transition: color 0.2s;
}

#login:hover {
    text-decoration: underline;
    color: #79c0ff;
}

@media (max-width: 600px) {
    .register-container {
        padding: 10px;
        min-height: 100vh;
        align-items: flex-start;
        width: 100vw;
    }

    .register-form {
        width: 100%;
        padding: 1.5rem;
        margin-top: 5vh;
        margin-bottom: 5vh;
    }

    h2 {
        font-size: 1.5rem;
    }
}
</style>