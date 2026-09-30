import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'items',
            component: () => import('@/views/Items.vue'),
        },
        {
            path: '/items/:_id/annotate',
            name: 'annotate',
            component: () => import('@/views/Annotate.vue'),
        },
        {
            path: '/camera',
            name: 'camera',
            component: () => import('@/views/Camera.vue'),
        },
        {
            path: '/settings',
            name: 'settings',
            component: () => import('@/views/Settings.vue'),
        },
        {
            path: '/about',
            name: 'about',
            component: () => import('@/views/About.vue'),
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'not_found',
            component: () => import('@/views/NotFound.vue'),
        },
    ],
})

export default router
