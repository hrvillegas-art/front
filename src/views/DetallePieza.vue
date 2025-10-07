<template>
  <div class="p-4 md:p-8 bg-gray-100 min-h-screen">

    <div v-if="loading" class="text-center py-20 bg-white rounded-xl shadow-lg">
      <p class="text-2xl text-blue-600 font-semibold">Cargando detalles de la pieza...</p>
    </div>

    <div v-else-if="error || !pieza" class="text-center py-20 bg-red-50 border border-red-300 rounded-xl shadow-lg max-w-2xl mx-auto">
      <h2 class="text-2xl text-red-700 font-bold mb-2">Pieza no encontrada 😔</h2>
      <p class="text-gray-600">{{ error || 'Verifica el ID o la disponibilidad del recurso.' }}</p>
    </div>

    <div v-else class="bg-white p-6 rounded-xl shadow-2xl border-t-4 border-blue-600 max-w-7xl mx-auto">
      
      <button 
        @click="goBack" 
        class="flex items-center text-blue-600 hover:text-blue-800 transition duration-150 mb-6 font-medium"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Volver al Catálogo
      </button>

      <div class="flex justify-between items-start mb-6 border-b pb-4">
        <h1 class="text-3xl font-extrabold text-gray-900">
          {{ pieza.genero }} <span class="text-blue-600">{{ pieza.especie }}</span>
        </h1>
        <button @click="handleCambiosDeterminacion" class="text-blue-600 hover:underline text-sm font-medium">
          Cambios en la determinación
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div class="lg:col-span-2 space-y-8">
          
          <section class="p-4 border rounded-lg bg-gray-50 shadow-inner">
            <h2 class="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Información de la Muestra</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-gray-700 text-sm">
              <p><strong>Nº Catálogo:</strong> <span class="font-mono text-lg text-red-600">{{ pieza.numeroCatalogo }}</span></p>
              <p><strong>Colector:</strong> {{ pieza.colector }} ({{ pieza.numeroColector }})</p>
              <p><strong>Fecha Colección:</strong> {{ formatDate(pieza.fechaColeccion) }}</p>
              <p><strong>Determinador:</strong> {{ pieza.determinador || 'Sin especificar' }}</p>
            </div>
          </section>

          <section class="p-4 border rounded-lg shadow-md">
            <h2 class="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Clasificación Taxonómica</h2>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div><strong>Reino:</strong> {{ pieza.reino }}</div>
                <div><strong>División:</strong> {{ pieza.division }}</div>
                <div><strong>Clase:</strong> {{ pieza.clase }}</div>
                <div><strong>Orden:</strong> {{ pieza.orden }}</div>
                <div><strong>Familia:</strong> <span class="font-medium">{{ pieza.familia }}</span></div>
                <div><strong>Género:</strong> <span class="font-medium">{{ pieza.genero }}</span></div>
                <div class="col-span-2"><strong>Especie:</strong> <span class="italic text-green-700">{{ pieza.especie }}</span></div>
            </div>
          </section>
          
          <section class="p-4 border rounded-lg bg-blue-50 shadow-md">
            <h2 class="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Información Geográfica</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-gray-700 text-sm">
              <p><strong>Ubicación:</strong> {{ pieza.localidad }} ({{ pieza.municipio }}, {{ pieza.departamento }})</p>
              <p><strong>País:</strong> {{ pieza.pais }}</p>
              <p><strong>Altitud:</strong> {{ pieza.altitud || 'N/A' }}</p>
              <p><strong>Coordenadas:</strong> Lat {{ pieza.latitud }}, Long {{ pieza.longitud || 'N/A' }} ({{ pieza.datumGeodesico }})</p>
            </div>
          </section>

        </div>

        <div class="lg:col-span-1 flex flex-col items-center p-4 bg-gray-100 rounded-lg shadow-inner">
             <div class="w-full text-center mb-4">
                 <p class="text-sm font-semibold text-gray-500 mb-2">Pieza Coleccionada</p>
                 <span class="text-xl font-mono">{{ pieza.tipocolleccion_nombre || 'N/A' }}</span>
             </div>

             <img 
               :src="pieza.imagen_url || '/placeholder.png'" 
               :alt="`Imagen de ${pieza.especie}`" 
               class="w-full h-auto max-h-96 object-cover rounded-lg shadow-xl border-4 border-white"
             />
             
             <div class="mt-4 text-center">
                 <p class="text-xs text-gray-500">Código de Barras del Catálogo</p>
                 <p class="font-mono text-sm mt-1">{{ pieza.numeroCatalogo }}</p>
             </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router' // Importamos useRouter para navegar
import axios from 'axios'

const route = useRoute()
const router = useRouter() // Inicializamos el router
const pieza = ref(null)
const loading = ref(true)
const error = ref(null)

const fetchPiezaDetails = async () => {
    // ... (Lógica de fetchDetails omitida por ser igual a la anterior)
    try {
        const id = route.params.id;
        const res = await axios.get(`http://127.0.0.1:8000/api/piezas/${id}`);
        
        if (res.data && res.data.id) {
             pieza.value = res.data;
        } else if (res.data && res.data.data && res.data.data.id) {
             pieza.value = res.data.data;
        } else {
             error.value = "La pieza no existe o el formato de la respuesta es incorrecto.";
        }
    } catch (err) {
        console.error("Error al cargar los detalles:", err.response ? err.response.status : err);
        error.value = "Error de conexión o recurso no encontrado (404).";
    } finally {
        loading.value = false;
    }
};

const goBack = () => {
    // Esta función hace exactamente lo mismo que el botón 'Atrás' del navegador.
    // Es el método preferido en Vue Router para volver a la página anterior.
    router.go(-1); 
};

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch (e) {
        return dateString;
    }
};

const handleCambiosDeterminacion = () => {
  alert('Navegar o abrir modal para Cambios en la determinación de la pieza.');
};

onMounted(() => {
    fetchPiezaDetails();
});
</script>