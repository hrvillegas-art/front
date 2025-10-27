import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import axios from 'axios';
import('jquery').then(($) => {
  window.$ = window.jQuery = $
})


// PrimeVue + Aura Theme
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';

// Componentes PrimeVue
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';
import Card from 'primevue/card';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Chart from 'primevue/chart';
import "leaflet/dist/leaflet.css";


// Estilos
import 'primeicons/primeicons.css';
import '@/assets/styles.scss';


// Configurar Axios globalmente
axios.defaults.baseURL = 'http://127.0.0.1:8000';
axios.defaults.withCredentials = true;
window.axios = axios;

// === CONFIGURAR RUTAS PÚBLICAS ===
const publicRoutes = [
  '/auth/login',
  '/landing',
  '/catalogo'
];

// === RUTAS PRIVADAS ===
const privatePrefixes = [
  '/pages/crud',
  '/estadisticas'
];

// Crear app
const app = createApp(App);

// Protección de rutas
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');

  const isPublic =
    publicRoutes.includes(to.path) ||
    to.path.startsWith('/piezas/');

  const isPrivate =
    privatePrefixes.some(prefix => to.path.startsWith(prefix));

  if (isPrivate && !token) {
    next('/auth/login');
  } else {
    next();
  }
});

app.use(router);
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: { darkModeSelector: '.app-dark' }
  }
});
app.use(ToastService);
app.use(ConfirmationService);

// Registrar componentes globalmente
app.component('Dropdown', Dropdown);
app.component('Button', Button);
app.component('Card', Card);
app.component('DataTable', DataTable);
app.component('Column', Column);
app.component('Chart', Chart);

app.mount('#app');
