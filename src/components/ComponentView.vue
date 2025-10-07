<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { Bar } from "vue-chartjs";

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const stats = ref([]);
const loading = ref(true);

// Fechas seleccionadas
const fechaInicio = ref("");
const fechaFin = ref("");

// Datos para la gráfica
const chartData = ref({
  labels: [],
  datasets: [
    {
      label: "Número de vistas",
      data: [],
      backgroundColor: "rgba(54, 162, 235, 0.7)",
    },
  ],
});

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { position: "top" },
    title: { display: true, text: "Estadísticas de Colecciones" },
  },
};

async function cargarEstadisticas() {
  loading.value = true;
  try {
    const { data } = await axios.get("/api/estadisticas/colecciones", {
      params: {
        fecha_inicio: fechaInicio.value,
        fecha_fin: fechaFin.value,
      },
    });

    stats.value = data.data;
    chartData.value.labels = stats.value.map((s) => s.coleccion.nombre);
    chartData.value.datasets[0].data = stats.value.map((s) => s.total_vistas);
  } catch (error) {
    console.error("Error cargando estadísticas", error);
  } finally {
    loading.value = false;
  }
}

// 📌 Funciones rápidas para rangos de fecha
function setFiltro(tipo) {
  const hoy = new Date();

  if (tipo === "hoy") {
    fechaInicio.value = fechaFin.value = hoy.toISOString().slice(0, 10);
  } else if (tipo === "semana") {
    const inicio = new Date(hoy);
    inicio.setDate(hoy.getDate() - 7);
    fechaInicio.value = inicio.toISOString().slice(0, 10);
    fechaFin.value = hoy.toISOString().slice(0, 10);
  } else if (tipo === "mes") {
    const inicio = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    fechaInicio.value = inicio.toISOString().slice(0, 10);
    fechaFin.value = hoy.toISOString().slice(0, 10);
  } else if (tipo === "anio") {
    const inicio = new Date(hoy.getFullYear(), 0, 1);
    fechaInicio.value = inicio.toISOString().slice(0, 10);
    fechaFin.value = hoy.toISOString().slice(0, 10);
  }

  cargarEstadisticas();
}

onMounted(() => {
  setFiltro("mes"); // Por defecto, estadísticas del mes
});
</script>

<template>
  <div class="estadisticas">
    <h2 class="text-xl font-bold mb-4">📊 Estadísticas de Colecciones</h2>

    <!-- Filtros -->
    <div class="flex gap-2 mb-4">
      <button @click="setFiltro('hoy')" class="px-3 py-1 bg-blue-500 text-white rounded">
        Hoy
      </button>
      <button @click="setFiltro('semana')" class="px-3 py-1 bg-blue-500 text-white rounded">
        Últimos 7 días
      </button>
      <button @click="setFiltro('mes')" class="px-3 py-1 bg-blue-500 text-white rounded">
        Este mes
      </button>
      <button @click="setFiltro('anio')" class="px-3 py-1 bg-blue-500 text-white rounded">
        Este año
      </button>
    </div>

    <!-- Selector personalizado -->
    <div class="flex gap-2 mb-4">
      <label>Inicio:</label>
      <input type="date" v-model="fechaInicio" class="border px-2 py-1" />
      <label>Fin:</label>
      <input type="date" v-model="fechaFin" class="border px-2 py-1" />
      <button @click="cargarEstadisticas" class="px-3 py-1 bg-green-600 text-white rounded">
        Aplicar
      </button>
    </div>

    <div v-if="loading">Cargando estadísticas...</div>

    <div v-else>
      <!-- Gráfica -->
      <Bar :data="chartData" :options="chartOptions" class="mb-6" />

      <!-- Tabla -->
      <table class="w-full border-collapse border border-gray-300">
        <thead class="bg-gray-100">
          <tr>
            <th class="border border-gray-300 px-4 py-2 text-left">Colección</th>
            <th class="border border-gray-300 px-4 py-2 text-center">Vistas</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="s in stats" :key="s.coleccion_id">
            <td class="border border-gray-300 px-4 py-2">{{ s.coleccion.nombre }}</td>
            <td class="border border-gray-300 px-4 py-2 text-center">{{ s.total_vistas }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.estadisticas {
  max-width: 900px;
  margin: auto;
  padding: 20px;
}
</style>
