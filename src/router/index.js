import AppLayout from '@/layout/AppLayout.vue';
import { createRouter, createWebHistory } from 'vue-router';
import Catalogo from '../views/Catalogo.vue';
import DetallePieza from '../views/DetallePieza.vue';

const appRoutes = [
    {
        path: '/',
        component: AppLayout,
        children: [
            // === NUEVAS RUTAS ===
            {
                path: '/catalogo',
                name: 'Catalogo',
                component: Catalogo
            },
            {
                path: '/piezas/:id',
                name: 'DetallePieza',
                component: DetallePieza
            },
            {
                path: '/estadisticas',
                name: 'EstadisticasColecciones',
                component: () => import('@/views/EstadisticasColecciones.vue'),
                meta: { requiresAuth: true } // 🔒 protegida
            },
            {
                path: '/estadisticas/:id',
                name: 'EstadisticasColeccion',
                component: () => import('@/views/EstadisticasColeccion.vue'),
                meta: { requiresAuth: true } // 🔒 protegida
            },

            // === RUTAS EXISTENTES ===
            {
                path: '/',
                name: 'dashboard',
                component: () => import('@/views/Dashboard.vue'),
                meta: { requiresAuth: true } // 🔒 protegida
            },
            {
                path: '/pages/crud',
                name: 'crud',
                component: () => import('@/views/pages/Crud.vue'),
                meta: { requiresAuth: true } // 🔒 protegida
            },
            {
                path: '/pages/crud2',
                name: 'crud2',
                component: () => import('@/views/pages/Crud2.vue'),
                meta: { requiresAuth: true } // 🔒 protegida
            },
            {
                path: '/pages/crud3',
                name: 'crud3',
                component: () => import('@/views/pages/Crud3.vue'),
                meta: { requiresAuth: true } // 🔒 protegida
            },
            // demás rutas de UI y páginas (no necesitan protección si son públicas)
            {
                path: '/uikit/formlayout',
                name: 'formlayout',
                component: () => import('@/views/uikit/FormLayout.vue')
            },
            {
                path: '/uikit/input',
                name: 'input',
                component: () => import('@/views/uikit/InputDoc.vue')
            },
            {
                path: '/uikit/button',
                name: 'button',
                component: () => import('@/views/uikit/ButtonDoc.vue')
            },
            {
                path: '/uikit/table',
                name: 'table',
                component: () => import('@/views/uikit/TableDoc.vue')
            },
            {
                path: '/uikit/list',
                name: 'list',
                component: () => import('@/views/uikit/ListDoc.vue')
            },
            {
                path: '/uikit/tree',
                name: 'tree',
                component: () => import('@/views/uikit/TreeDoc.vue')
            },
            {
                path: '/uikit/panel',
                name: 'panel',
                component: () => import('@/views/uikit/PanelsDoc.vue')
            },
            {
                path: '/uikit/overlay',
                name: 'overlay',
                component: () => import('@/views/uikit/OverlayDoc.vue')
            },
            {
                path: '/uikit/media',
                name: 'media',
                component: () => import('@/views/uikit/MediaDoc.vue')
            },
            {
                path: '/uikit/message',
                name: 'message',
                component: () => import('@/views/uikit/MessagesDoc.vue')
            },
            {
                path: '/uikit/file',
                name: 'file',
                component: () => import('@/views/uikit/FileDoc.vue')
            },
            {
                path: '/uikit/menu',
                name: 'menu',
                component: () => import('@/views/uikit/MenuDoc.vue')
            },
            {
                path: '/uikit/charts',
                name: 'charts',
                component: () => import('@/views/uikit/ChartDoc.vue')
            },
            {
                path: '/uikit/misc',
                name: 'misc',
                component: () => import('@/views/uikit/MiscDoc.vue')
            },
            {
                path: '/uikit/timeline',
                name: 'timeline',
                component: () => import('@/views/uikit/TimelineDoc.vue')
            },
            {
                path: '/pages/empty',
                name: 'empty',
                component: () => import('@/views/pages/Empty.vue')
            },
            {
                path: '/documentation',
                name: 'documentation',
                component: () => import('@/views/pages/Documentation.vue')
            }
        ]
    },
    // === RUTAS SIN LAYOUT (PÚBLICAS) ===
    {
        path: '/landing',
        name: 'landing',
        component: () => import('@/views/pages/Landing.vue')
    },
    {
        path: '/pages/notfound',
        name: 'notfound',
        component: () => import('@/views/pages/NotFound.vue')
    },
    {
        path: '/auth/login',
        name: 'login',
        component: () => import('@/views/pages/auth/Login.vue'),
        meta: { requiresAuth: false }
    },
    {
        path: '/auth/access',
        name: 'accessDenied',
        component: () => import('@/views/pages/auth/Access.vue')
    },
    {
        path: '/auth/error',
        name: 'error',
        component: () => import('@/views/pages/auth/Error.vue')
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes: appRoutes
});

// 🔒 Protección de rutas
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token');

    if (to.meta.requiresAuth && !token) {
        next('/auth/login'); // Redirige al login si no hay token
    } else if (to.path === '/auth/login' && token) {
        next('/pages/crud'); // Evita que un usuario logueado regrese al login
    } else {
        next();
    }
});

export default router;
