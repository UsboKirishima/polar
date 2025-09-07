import { createRouter, createWebHistory } from 'vue-router';
import Feed from '@/Feed.vue';
import Login from '@/Login.vue';
import Profile from '@/Profile.vue';
import Register from '@/Register.vue';
import Users from '@/Users.vue';
import NotFound from '@/components/NotFound.vue';
import ExHome from '@/ExHome.vue';
import UserDetails from '@/UserDetails.vue';
import { useAuthStore } from '@/stores/auth';
import Friends from '@/Friends.vue';

const routes = [
    {
        path: '/',
        name: 'home',
        component: ExHome,
        meta: { requiresAuth: true }
    },
    {
        path: '/feed',
        name: 'feed',
        component: Feed,
        meta: { requiresAuth: true }
    },
    {
        path: '/friends',
        name: 'friends',
        component: Friends,
        meta: { requiresAuth: true }
    },
    {
        path: '/login',
        name: 'login',
        component: Login
    },
    {
        path: '/profile',
        name: 'profile',
        component: Profile,
        meta: { requiresAuth: true }
    },
    {
        path: '/register',
        name: 'register',
        component: Register
    },
    {
        path: '/users',
        name: 'users',
        component: Users,
        meta: { requiresAuth: true }
    },
    {
        path: '/users/:id',
        name: 'user-details',
        component: UserDetails,
        props: true,
        meta: { requiresAuth: true }
    },
    {
        path: '/:catchAll(.*)',
        name: 'not-found',
        component: NotFound
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach(async (to, from, next) => {
    const auth = useAuthStore()

    if (!auth.loading) {
        await auth.checkAuth()
    }

    if (to.meta.requiresAuth && !auth.isLoggedIn) {
        next('/login')
    } else {
        next()
    }
})


export default router;
