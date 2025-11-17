import { createApp } from 'vue'
import { createPinia } from 'pinia'

import { useAuthStore } from './stores/auth'
import router from './router'

import { VueQueryPlugin } from "@tanstack/vue-query";
import { createTRPCClientProxy, httpBatchLink } from "@trpc/client";
import { trpc } from './trpc';

import App from './App.vue'
import './assets/main.css'

const app = createApp(App)
app.use(router)
app.use(createPinia())

const auth = useAuthStore()
auth.checkAuth()

app
    .use(VueQueryPlugin)
    .mount('#app')
