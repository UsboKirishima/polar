import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './assets/main.css'
import { useAuthStore } from './stores/auth'
import router from './router'

const app = createApp(App)
app.use(router)
app.use(createPinia())

const auth = useAuthStore()
auth.checkAuth()

app.mount('#app')
