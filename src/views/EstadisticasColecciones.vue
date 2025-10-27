<template>
  <div class="p-6 md:p-8 bg-gray-100 min-h-screen">

    <!-- Loading -->
    <div v-if="loading" class="text-center py-20 bg-white rounded-xl shadow-lg">
      <p class="text-2xl text-blue-600 font-semibold">Cargando estadísticas...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="text-center py-20 bg-red-50 border border-red-300 rounded-xl shadow-lg max-w-2xl mx-auto">
      <h2 class="text-2xl text-red-700 font-bold mb-2">Error 😔</h2>
      <p class="text-gray-600">{{ error }}</p>
    </div>

    <!-- Estadísticas -->
    <div v-else class="bg-white p-6 rounded-xl shadow-2xl border-t-4 border-blue-600 max-w-7xl mx-auto">
      <h1 class="text-3xl font-extrabold text-gray-900 mb-6">📊 Estadísticas de Piezas por Colección</h1>

      <div v-for="coleccion in colecciones" :key="coleccion.id" class="mb-8">
        <h2 class="text-xl font-semibold text-gray-800 mb-2">{{ coleccion.coleccion }}</h2>

        <table class="min-w-full bg-white border rounded-lg shadow-md">
          <thead>
            <tr class="bg-blue-100 text-left">
              <th class="px-4 py-2">ID</th>
              <th class="px-4 py-2">Nombre / Especie</th>
              <th class="px-4 py-2">Vistas</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="pieza in coleccion.piezas" :key="pieza.id" class="border-b hover:bg-gray-50">
              <td class="px-4 py-2">{{ pieza.id }}</td>
              <!-- Mostrar solo especie o genero, y si no existe mostrar "Sin nombre" -->
              <td class="px-4 py-2">{{ pieza.nombre || 'Sin nombre' }}</td>
              <td class="px-4 py-2">{{ pieza.vistas }}</td>
            </tr>
            <tr v-if="coleccion.piezas.length === 0" class="border-b bg-gray-50">
              <td colspan="3" class="px-4 py-2 text-center">No hay piezas en esta colección</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const API_BASE_URL = 'http://127.0.0.1:8000/api'

const colecciones = ref([])
const loading = ref(true)
const error = ref(null)

const fetchColeccionesConPiezas = async () => {
  loading.value = true
  error.value = null
  try {
    const res = await axios.get(`${API_BASE_URL}/colecciones-con-piezas`)

    // Mapear los datos para mostrar solo especie/genero y vistas
    colecciones.value = res.data.map(coleccion => ({
      id: coleccion.id,
      coleccion: coleccion.coleccion,
      piezas: coleccion.piezas.map(pieza => ({
        id: pieza.id,
        nombre: pieza.nombre,  // Aquí ya viene solo especie o genero desde backend
        vistas: pieza.vistas
      }))
    }))

  } catch (err) {
    console.error(err)
    error.value = 'No se pudo cargar la información de las colecciones y piezas.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchColeccionesConPiezas()
})
</script>

<style scoped>
table th, table td {
  border: 1px solid #ddd;
}
</style>
