<template>
  <div class="p-4 md:p-8 bg-gray-50 min-h-screen">
    <div class="bg-white p-8 rounded-2xl shadow-2xl border-t-4 border-blue-500 max-w-7xl mx-auto">

      <h1 class="text-4xl font-extrabold text-gray-800 mb-8 text-center">
        🏛️ Catálogo de Colecciones
      </h1>

      <!-- 🔍 Buscador -->
      <div class="p-6 mb-8 border rounded-2xl bg-gray-50 shadow-inner">
        <div class="flex flex-col sm:flex-row gap-4 mb-4 justify-center">
          <div class="flex items-center gap-6 text-gray-700 font-medium">
            <label>
              <input type="radio" v-model="searchType" value="especie" class="mr-2 accent-green-600" /> Especie
            </label>
            <label>
              <input type="radio" v-model="searchType" value="familia" class="mr-2 accent-green-600" /> Familia
            </label>
            <label>
              <input type="radio" v-model="searchType" value="genero" class="mr-2 accent-green-600" /> Género
            </label>
          </div>
        </div>

        <div class="flex gap-2 justify-center">
          <input
            v-model="searchTerm"
            @keyup.enter="fetchData"
            :placeholder="`Buscar por ${searchType}...`"
            class="border rounded-xl p-3 text-lg flex-1 max-w-md focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
          />
          <button
            @click="fetchData"
            class="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition duration-150 shadow-md"
          >
            Buscar
          </button>
        </div>
      </div>

      <!-- 📊 Estadísticas rápidas -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10 text-center">
        <div class="bg-blue-50 p-4 rounded-lg shadow-md border-l-4 border-blue-500">
          <p class="text-sm text-gray-500 font-medium">Total Piezas</p>
          <p class="text-2xl font-bold text-gray-900 mt-1">{{ totalPieces.toLocaleString() }}</p>
        </div>

        <div class="hidden lg:block"></div> 
        <div class="hidden sm:block"></div> 

        <div class="bg-yellow-50 p-4 rounded-lg shadow-md border-l-4 border-yellow-500">
          <p class="text-sm text-gray-500 font-medium">Página Actual</p>
          <p class="text-2xl font-bold text-gray-900 mt-1">Pág. {{ piezas.current_page || '1' }}</p>
        </div>
      </div>

      <!-- 📁 Resultados -->
      <h2 v-if="!loading" class="text-2xl font-semibold text-gray-700 mb-6 text-center">
        Resultados del Catálogo ({{ totalPieces }})
      </h2>

      <div v-if="loading" class="text-center py-16 text-xl text-blue-600 animate-pulse">
        Cargando piezas del catálogo...
      </div>

      <div
        v-else-if="!piezas.data || piezas.data.length === 0"
        class="text-center py-10 border border-yellow-300 rounded-xl bg-yellow-50"
      >
        <p class="text-xl text-yellow-800 font-semibold">🔍 No se encontraron resultados.</p>
        <p class="text-gray-600">Intenta buscar con otro criterio o palabra clave.</p>
      </div>

      <!-- 🧩 Tarjetas -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="p in piezas.data"
          :key="p.id"
          class="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1 overflow-hidden border border-gray-100"
        >
          <!-- Imagen -->
          <div class="relative h-56 overflow-hidden group">
            <img
              :src="getImagenUrl(p.imagen)"
              alt="Imagen de la pieza"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              @error="onImageError"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
          </div>

          <!-- Texto -->
          <div class="p-5">
            <p class="text-xs font-semibold uppercase text-green-600 mb-1">
              {{ p.tipocolleccion_nombre || 'Colección Desconocida' }}
            </p>

            <h3 class="text-xl font-bold text-gray-900 mb-1">
              {{ p.especie || 'Desconocida' }}
            </h3>

            <p class="text-sm text-gray-500 italic mb-2">
              Familia: {{ p.familia || 'N/A' }} · Género: {{ p.genero || 'N/A' }}
            </p>

            <div class="flex items-center text-sm text-gray-600 mt-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fill-rule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clip-rule="evenodd"
                />
              </svg>
              <span>{{ p.localidad || 'Ubicación no registrada' }}</span>
            </div>

            <button
              @click="verDetalle(p.id)"
              class="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-150"
            >
              Ver más detalles
            </button>
          </div>
        </div>
      </div>

      <!-- 🔢 Paginación -->
      <div v-if="piezas.data && piezas.data.length > 0" class="flex justify-center gap-4 mt-10 p-4 border-t">
        <button
          :disabled="!piezas.prev_page_url"
          @click="fetchData(piezas.current_page - 1)"
          class="px-5 py-2 border rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
        >
          ⬅️ Anterior
        </button>

        <span class="px-4 py-2 text-gray-700 font-medium">
          Página {{ piezas.current_page }} de {{ piezas.last_page }}
        </span>

        <button
          :disabled="!piezas.next_page_url"
          @click="fetchData(piezas.current_page + 1)"
          class="px-5 py-2 border rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
        >
          Siguiente ➡️
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const piezas = ref({});
const searchTerm = ref("");
const searchType = ref("genero");
const router = useRouter();
const loading = ref(true);
const totalPieces = ref(0);

const API_URL = "http://127.0.0.1:8000/api/piezas/publicadas";

async function fetchData(page = 1) {
  loading.value = true;
  const params = { page };

  if (searchTerm.value) params[searchType.value] = searchTerm.value;

  try {
    const res = await axios.get(API_URL, { params });
    piezas.value = res.data || { data: [], total: 0 };
    totalPieces.value = res.data?.total || 0;
  } catch (error) {
    console.error("Error al obtener las piezas publicadas:", error);
    piezas.value = { data: [], total: 0 };
    totalPieces.value = 0;
  } finally {
    loading.value = false;
  }
}

function getImagenUrl(imagen) {
  if (!imagen) return "https://via.placeholder.com/300x200?text=Sin+Imagen";
  return `http://127.0.0.1:8000/storage/${imagen}`;
}

function onImageError(event) {
  event.target.src = "https://via.placeholder.com/300x200?text=Imagen+no+disponible";
}

function verDetalle(id) {
  router.push(`/piezas/${id}`);
}

onMounted(fetchData);
</script>
