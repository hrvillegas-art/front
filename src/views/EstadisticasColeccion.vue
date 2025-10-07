<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold mb-6 text-gray-800">
      📈 Estadísticas de la Colección #{{ $route.params.id }}
    </h2>

    <Card class="mb-6 shadow-md">
      <template #title>Vistas Recientes</template>
      <template #content>
        <Chart type="line" :data="chartData" :options="chartOptions" style="height: 400px;" />
      </template>
    </Card>

    <Card>
      <template #title>Detalle de Vistas</template>
      <template #content>
        <DataTable :value="views" paginator rows="10" responsiveLayout="scroll">
          <Column field="user_id" header="Usuario"></Column>
          <Column field="ip_address" header="IP"></Column>
          <Column field="created_at" header="Fecha"></Column>
        </DataTable>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Chart from 'primevue/chart';
import Card from 'primevue/card';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { useRoute } from 'vue-router';

const route = useRoute();
const views = ref([]);
const chartData = ref({});
const chartOptions = ref({});

const fetchData = async () => {
  try {
    const response = await axios.get(`/api/view/obtener/${route.params.id}`);
    views.value = response.data.obj || [];

    // Agrupar por fecha
    const grouped = {};
    views.value.forEach(v => {
      const date = new Date(v.created_at).toLocaleDateString();
      grouped[date] = (grouped[date] || 0) + 1;
    });

    chartData.value = {
      labels: Object.keys(grouped),
      datasets: [
        {
          label: 'Vistas por día',
          borderColor: '#3B82F6',
          fill: false,
          tension: 0.4,
          data: Object.values(grouped)
        }
      ]
    };

    chartOptions.value = {
      plugins: { legend: { labels: { color: '#374151' } } },
      scales: {
        x: { ticks: { color: '#6B7280' } },
        y: { ticks: { color: '#6B7280' } }
      }
    };
  } catch (error) {
    console.error('Error al cargar las vistas:', error);
  }
};

onMounted(fetchData);
</script>
