<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold mb-6 text-gray-800">
      📊 Estadísticas de Colecciones
    </h2>

    <!-- Filtro por colección -->
    <div class="flex items-center gap-4 mb-4">
      <select v-model="selectedColeccion" class="border rounded p-2">
        <option :value="null">Todas las colecciones</option>
        <option v-for="c in colecciones" :key="c.id" :value="c.id">
          {{ c.nombre }}
        </option>
      </select>
      <button @click="cargarEstadisticas" class="bg-blue-500 text-white px-4 py-2 rounded">
        Filtrar
      </button>
    </div>

    <!-- Tabla de estadísticas -->
    <table class="min-w-full border border-gray-300">
      <thead>
        <tr class="bg-gray-100">
          <th class="border px-4 py-2">Tipo Colección</th>
          <th class="border px-4 py-2">Total Vistas</th>
          <th class="border px-4 py-2">Último Registro</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in estadisticas" :key="item.tipo_colleccion_id">
          <td class="border px-4 py-2">{{ item.coleccion ? item.coleccion.nombre : 'Sin nombre' }}</td>
          <td class="border px-4 py-2">{{ item.total_vistas }}</td>
          <td class="border px-4 py-2">{{ formatDate(item.ultimo_registro) }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Paginación simple -->
    <div class="mt-4 flex gap-2">
      <button 
        @click="cambiarPagina(page - 1)" 
        :disabled="page <= 1"
        class="px-3 py-1 bg-gray-300 rounded"
      >Anterior</button>
      <span>Página {{ page }}</span>
      <button 
        @click="cambiarPagina(page + 1)" 
        :disabled="page >= lastPage"
        class="px-3 py-1 bg-gray-300 rounded"
      >Siguiente</button>
    </div>

    <!-- Mensaje de error -->
    <div v-if="errorMsg" class="mt-4 text-red-500">
      {{ errorMsg }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

// Variables reactivas
const colecciones = ref([]);
const selectedColeccion = ref(null);
const estadisticas = ref([]);
const page = ref(1);
const numero_items = ref(10);
const lastPage = ref(1);
const errorMsg = ref('');

// Cargar colecciones para el filtro
async function cargarColecciones() {
  try {
    const res = await axios.get('http://127.0.0.1:8000/api/tipocollecciones');
    colecciones.value = res.data.data || [];
  } catch (error) {
    console.error("Error al cargar colecciones:", error);
    errorMsg.value = "No se pudieron cargar las colecciones.";
  }
}

// Función para cargar estadísticas
async function cargarEstadisticas() {
  try {
    errorMsg.value = '';
    const res = await axios.post('http://127.0.0.1:8000/api/vistas/listar', {
      tipo_colleccion_id: selectedColeccion.value ? parseInt(selectedColeccion.value) : null,
      page: page.value,
      numero_items: numero_items.value
    });
    estadisticas.value = res.data.data || [];
    lastPage.value = res.data.last_page || 1;
  } catch (error) {
    console.error("Error al cargar estadísticas:", error);
    errorMsg.value = "No se pudieron cargar las estadísticas.";
  }
}

// Cambiar página
function cambiarPagina(p) {
  if (p >= 1 && p <= lastPage.value) {
    page.value = p;
    cargarEstadisticas();
  }
}

// Formatear fecha
function formatDate(dateStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleString();
}

// Ejecutar al montar
onMounted(async () => {
  await cargarColecciones();
  await cargarEstadisticas();
});
</script>

<style scoped>
table {
  border-collapse: collapse;
}
th, td {
  text-align: left;
}
</style>
