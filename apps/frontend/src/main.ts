import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './assets/main.css'
import { useAuthStore } from './stores/auth'
import router from './router'
import { VueQueryPlugin } from "@tanstack/vue-query";

const app = createApp(App)
app.use(router)
app.use(createPinia())

const auth = useAuthStore()
auth.checkAuth()

app
    .use(VueQueryPlugin)
    .mount('#app')
