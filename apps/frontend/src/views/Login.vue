<script setup lang="ts">
import api from '@/axiosApi'
import { onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { useDeviceType } from '@/composables/useDeviceType'
import { useLogStore } from '@/stores/logs'
const auth = useAuthStore()

const email = ref('')
const password = ref('')
const error = ref('')
const isLoading = ref(false)

const { deviceType, isMobile } = useDeviceType()

const router = useRouter()
const logStore = useLogStore();

const handleLogin = async () => {
    error.value = ''

    const success = await auth.login(email.value, password.value)

    if (success) {
        logStore.showSuccess(`Successfully logged in as ${auth.user?.profile?.username}`)
        router.push(`/users/${auth.user?.id}`)
    } else {
        error.value = 'Invalid email or password.'
    }
}
const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
        handleLogin()
    }
}

onMounted(() => {
    if (auth.isLoggedIn) {
        router.push(`/users/${auth.user?.id}`)
    }
})
</script>

<template>
    <div class="login-container">
        <form @submit.prevent="handleLogin" class="login-form">
            <h2>Login</h2>

            <div class="form-group">
                <label for="email">Email:</label>
                <input
                    id="email"
                    type="email"
                    v-model="email"
                    @keypress="handleKeyPress"
                    placeholder="Insert email"
                    required
                    :disabled="isLoading"
                />
            </div>

            <div class="form-group">
                <label for="password">Password:</label>
                <input
                    id="password"
                    type="password"
                    v-model="password"
                    @keypress="handleKeyPress"
                    placeholder="Insert password"
                    required
                    :disabled="isLoading"
                />
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
    min-height: 100vh;
    padding: 20px;
    box-sizing: border-box;
}

.login-form {
    width: 90%;
    max-width: 400px;
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

.forgot_pwd {
    display: block;
    text-align: right;
    font-size: 0.9rem;
    color: #999;
    text-decoration: none;
    transition: color 0.2s;
}

.forgot_pwd:hover {
    color: #fff;
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
    transition:
        border-color 0.2s,
        background-color 0.2s;
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

.login-button {
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
    transition:
        background-color 0.2s,
        box-shadow 0.2s;
    margin-bottom: 15px;
    box-shadow: 0 2px 10px rgba(97, 175, 239, 0.4);
}

.login-button:hover:not(:disabled) {
    background-color: #79c0ff;
    box-shadow: 0 4px 15px rgba(97, 175, 239, 0.6);
}

.login-button:disabled {
    background-color: #444;
    color: #777;
    cursor: not-allowed;
    box-shadow: none;
}

#register {
    display: block;
    text-align: center;
    font-size: 0.9rem;
    color: #61afef;
    text-decoration: none;
    transition: color 0.2s;
}

#register:hover {
    text-decoration: underline;
    color: #79c0ff;
}

@media (max-width: 600px) {
    .login-container {
        padding: 10px;
        width: 100vw;
    }

    .login-form {
        width: 100%;
        padding: 1.5rem;
        margin-top: -15vh;
    }

    h2 {
        font-size: 1.5rem;
    }
}
</style>
