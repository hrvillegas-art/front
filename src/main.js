import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

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

// Estilos
import 'primeicons/primeicons.css';
import '@/assets/styles.scss';

// Crear app
const app = createApp(App);

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
