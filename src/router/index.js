import AppLayout from '@/layout/AppLayout.vue';
import { createRouter, createWebHistory } from 'vue-router';
// Estas importaciones estáticas son CORRECTAS
import Catalogo from '../views/Catalogo.vue';
import DetallePieza from '../views/DetallePieza.vue';

// 1. Define todas tus rutas en un solo array (lo llamaremos appRoutes)
const appRoutes = [
    // RUTA DE LA APLICACIÓN PRINCIPAL (Layout con barra lateral/encabezado)
    {
        path: '/',
        component: AppLayout,
        children: [
            // === TUS NUEVAS RUTAS PÚBLICAS DENTRO DEL LAYOUT ===
            {
                // NOTA IMPORTANTE: Si quieres que el catálogo se vea con el Layout
                // en /catalogo, esta es la forma correcta de anidarla.
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
  component: () => import('@/views/EstadisticasColecciones.vue')
},
{
  path: '/estadisticas/:id',
  name: 'EstadisticasColeccion',
  component: () => import('@/views/EstadisticasColeccion.vue')
},

            // === FIN DE TUS NUEVAS RUTAS ===


            // Rutas existentes de la plantilla (Dashboard, FormLayout, etc.)
            {
                path: '/', // Esta es la ruta raíz del Layout, que lleva al Dashboard
                name: 'dashboard',
                component: () => import('@/views/Dashboard.vue')
            },
            {
                path: '/uikit/formlayout',
                name: 'formlayout',
                component: () => import('@/views/uikit/FormLayout.vue')
            },
            // ... (el resto de tus 20+ rutas de uikit/pages) ...
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
                path: '/pages/crud',
                name: 'crud',
                component: () => import('@/views/pages/Crud.vue')
             },
             {
                path: '/documentation',
                name: 'documentation',
                component: () => import('@/views/pages/Documentation.vue')
             },
             {
                path: '/pages/crud2',
                name: 'crud2',
                component: () => import('@/views/pages/Crud2.vue')
             },
             {
                path: '/pages/crud3',
                name: 'crud3',
                component: () => import('@/views/pages/Crud3.vue')
             }
        ]
    },
    // RUTAS SIN LAYOUT (Landing, Auth, Errores)
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
        component: () => import('@/views/pages/auth/Login.vue')
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
    // 2. Pasamos el único array con todas las rutas
    routes: appRoutes 
});

export default router;