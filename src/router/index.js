import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const routes = [
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/LoginView.vue'),
        meta: { requiresGuest: true }
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import('@/views/RegisterView.vue'),
        meta: { requiresGuest: true }
    },
    {
        path: '/',
        name: 'Home',
        component: () => import('@/views/HomeView.vue'),
        meta: { requiresAuth: true }

    },
    {
        path: '/events/:id',
        name: 'EventDetail',
        component: () => import('@/views/EventDetailView.vue'),
        meta: { requiresAuth: true },
        props: true
    },
    {
        path: '/admin',
        name: 'AdminClub',
        component: () => import('@/views/AdminClubView.vue'),
        meta: { requiresAuth: true, requiresClub: true }
    },
    {
        path: '/admin/create',
        name: 'CreateEvent',
        component: () => import('@/views/CreateEventView.vue'),
        meta: { requiresAuth: true, requiresClub: true }
    },
    {
        path: '/validation',
        name: 'Validation',
        component: () => import('@/views/AdminValidationView.vue'),
        meta: { requiresAuth: true, requiresSuperAdmin: true }
    },
    {
        path: '/superadmin/panel',
        name: 'SuperAdminPanel',
        component: () => import('@/views/SuperAdminPanelView.vue'),
        meta: { requiresAuth: true, requiresSuperAdmin: true }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior() {
        return { top: 0 }
    }
})

router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore()

    // Wait for auth to initialize
    if (authStore.loading) {
        await new Promise((resolve) => {
            const unwatch = authStore.$subscribe((mutation, state) => {
                if (!state.loading) {
                    unwatch()
                    resolve()
                }
            })
            // If already resolved
            if (!authStore.loading) {
                unwatch()
                resolve()
            }
        })
    }

    const isAuthenticated = authStore.isAuthenticated
    const isClub = authStore.isClub
    const isSuperAdmin = authStore.isSuperAdmin

    if (to.meta.requiresAuth && !isAuthenticated) {
        next({ name: 'Login' })
    } else if (to.meta.requiresGuest && isAuthenticated) {
        next({ name: 'Home' })
    } else if (to.meta.requiresClub && !isClub) {
        next({ name: 'Home' })
    } else if (to.meta.requiresSuperAdmin && !isSuperAdmin) {
        next({ name: 'Home' })
    } else {
        next()
    }
})

export default router
