<script setup>
import { FilterMatchMode } from '@primevue/core/api';
import axios from 'axios';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';
import Calendar from 'primevue/calendar';

// Notificaciones
const toast = useToast();

// Refs
const fileupload = ref(null);
const dt = ref();
const products = ref([]); // piezas
const collections = ref([]); // colecciones
const productDialog = ref(false);
const deleteProductDialog = ref(false);
const deleteProductsDialog = ref(false);
const product = ref({});
const selectedProducts = ref();
const submitted = ref(false);
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  familia: { value: null, matchMode: FilterMatchMode.CONTAINS },
  genero: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

// Estado para ver detalles
const viewDialog = ref(false);
const selectedProduct = ref({});

// ✅ Formatear fecha
function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("es-CO", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });
}

// ✅ Ver detalles
const viewDetails = async (product) => {
  try {
    const response = await axios.get(`http://127.0.0.1:8000/api/piezas/${product.id}`);
    const data = response.data.data || response.data;
    selectedProduct.value = {
      ...data,
      imagen_url: data.imagen_url
    };
    viewDialog.value = true;
  } catch (error) {
    console.error("❌ Error al obtener detalles:", error.response?.data || error);
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los detalles', life: 3000 });
  }
};

// ✅ Cargar piezas y colecciones
onMounted(() => {
  getProducts();
  getCollections();
});

async function getProducts() {
  const res = await axios.get('http://127.0.0.1:8000/api/piezas/');
  products.value = res.data.data.map(p => ({
    ...p,
    imagen_url: p.imagen_url
  }));
}

async function getCollections() {
  const res = await axios.get('http://127.0.0.1:8000/api/tipocollecciones/');
  collections.value = res.data.data || res.data;
}

// ✅ Nuevo producto
function openNew() {
  product.value = {
    familia: '',
    genero: '',
    especie: '',
    numeroCatalogo: '',
    colector: '',
    numeroColector: '',
    fechaColeccion: '',
    reino: '',
    division: '',
    clase: '',
    orden: '',
    determinador: '',
    pais: '',
    departamento: '',
    municipio: '',
    localidad: '',
    altitud: '',
    latitud: '',
    datumGeodesico: '',
    tipocolleccion_id: null,
    imagen_url: null,
    estado: 1
  };
  submitted.value = false;
  productDialog.value = true;
}

// ✅ Ocultar diálogo
function hideDialog() {
  productDialog.value = false;
  submitted.value = false;
}

// ✅ Guardar (crear/editar)
async function saveProduct() {
  submitted.value = true;

  if (product.value.familia.trim()) {
    try {
      const formData = new FormData();

      for (const key in product.value) {
        if (key !== 'imagen' && key !== 'imagen_url' && product.value[key] !== null && product.value[key] !== undefined) {
          formData.append(key, product.value[key]);
        }
      }

      if (product.value.fechaColeccion instanceof Date) {
        formData.set("fechaColeccion", product.value.fechaColeccion.toISOString().split("T")[0]);
      }

      if (product.value.removeImage) {
        formData.append("removeImage", "true");
      }

      if (fileupload.value && fileupload.value.files.length > 0) {
        formData.append("imagen", fileupload.value.files[0]);
      }

      let res;
      if (product.value.id) {
        res = await axios.post(
          `http://127.0.0.1:8000/api/piezas/${product.value.id}?_method=PUT`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        toast.add({ severity: "success", summary: "Éxito", detail: "Pieza actualizada", life: 3000 });
      } else {
        res = await axios.post(
          `http://127.0.0.1:8000/api/piezas`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        toast.add({ severity: "success", summary: "Éxito", detail: "Pieza creada", life: 3000 });
      }

      productDialog.value = false;
      product.value = {};
      if (fileupload.value) fileupload.value.value = "";
      getProducts();
    } catch (error) {
      console.error("❌ Error al guardar:", error.response?.data || error);
      toast.add({ severity: "error", summary: "Error", detail: "No se pudo guardar", life: 3000 });
    }
  }
}

// ✅ Editar
function editProduct(productData) {
  product.value = { ...productData };
  productDialog.value = true;
}

// ✅ Eliminar 1 producto
function confirmDeleteProduct(productData) {
  product.value = { ...productData };
  deleteProductDialog.value = true;
}

async function deleteProduct() {
  await axios.delete(`http://127.0.0.1:8000/api/piezas/${product.value.id}`);
  products.value = products.value.filter((val) => val.id !== product.value.id);
  deleteProductDialog.value = false;
  product.value = {};
  toast.add({ severity: 'success', summary: 'Éxito', detail: 'Pieza eliminada', life: 3000 });
  getProducts();
}

// ✅ Eliminar seleccionados
function confirmDeleteSelected() {
  deleteProductsDialog.value = true;
}

async function deleteSelectedProducts() {
  const idsToDelete = selectedProducts.value.map(p => p.id);
  await axios.post(`http://127.0.0.1:8000/api/piezas/delete-multiple`, { ids: idsToDelete });
  products.value = products.value.filter((val) => !idsToDelete.includes(val.id));
  deleteProductsDialog.value = false;
  selectedProducts.value = null;
  toast.add({ severity: 'success', summary: 'Éxito', detail: 'Piezas eliminadas', life: 3000 });
  getProducts();
}

// ✅ Quitar imagen
function removeImage() {
  product.value.imagen_url = null;
  product.value.removeImage = true;
}

// ✅ Publicar / Despublicar
async function togglePublishStatus(id) {
  try {
    const response = await axios.patch(`http://127.0.0.1:8000/api/piezas/${id}/toggle-publish`);
    toast.add({ severity: 'success', summary: 'Éxito', detail: response.data.message, life: 3000 });

    const index = products.value.findIndex(p => p.id === id);
    if (index !== -1) {
      products.value[index].is_published = !products.value[index].is_published;
    }
  } catch (error) {
    console.error("❌ Error al cambiar el estado:", error.response?.data || error);
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cambiar el estado', life: 3000 });
  }
}
</script>

<template>
  <div>
    <div class="card">
      <Toolbar class="mb-6">
        <template #start>
          <Button label="Nuevo" icon="pi pi-plus" severity="secondary" class="mr-2" @click="openNew" />
          <Button label="Eliminar" icon="pi pi-trash" severity="secondary" class="mr-2"
                  @click="confirmDeleteSelected"
                  :disabled="!selectedProducts || !selectedProducts.length" />
          <Button label="Ver Detalles" icon="pi pi-eye" severity="info"
                  @click="viewDetails(selectedProducts[0])"
                  :disabled="!selectedProducts || selectedProducts.length !== 1" />
          <div class="flex gap-2 mb-3">
    <!-- Filtro por familia -->
    <span class="p-input-icon-left">
      <i class="pi pi-search" />
      <InputText
        v-model="filters.familia.value"
        placeholder="Buscar por familia"
      />
    </span>
</div>
    <!-- Filtro por género -->
     <div class="flex gap-2 mb-3">
    <span class="p-input-icon-left">
      <i class="pi pi-search" />
      <InputText
        v-model="filters.genero.value"
        placeholder="Buscar por género"
      />
    </span>
  </div>

        </template>
      </Toolbar>
    </div>

    <div class="card">
      <!-- ✅ Tabla -->
      <DataTable
        ref="dt"
        :value="products"
        selectionMode="checkbox"
        v-model:selection="selectedProducts"
        dataKey="id"
        :paginator="true"
        :rows="10"
        :filters="filters"
        :globalFilterFields="['familia', 'genero', 'especie', 'numeroCatalogo', 'colector']"
        :rowsPerPageOptions="[5, 10, 25]"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} piezas"
        responsiveLayout="scroll"
        class="datatable-responsive"
      >
        <Column selectionMode="multiple" headerStyle="width: 3em"></Column>
        
        <Column field="id" header="ID" sortable style="min-width: 5rem" />
        <Column field="tipocolleccion_id" header="Coleccion perteneciente" sortable style="min-width: 10rem">
          <template #body="slotProps">
            {{ collections.find(c => c.id === slotProps.data.tipocolleccion_id)?.nombre || '—' }}
          </template>
        </Column>
        <Column field="familia" header="Familia" sortable style="min-width: 10rem"></Column>
        <Column field="genero" header="Género" sortable style="min-width: 10rem"></Column>
        <Column field="especie" header="Especie" sortable style="min-width: 10rem"></Column>
        <Column field="numeroCatalogo" header="Número Catálogo" sortable style="min-width: 10rem"></Column>
        <Column field="tipocolleccion_id" header="Tipo Colección" sortable style="min-width: 10rem">
          <template #body="slotProps">
            {{ collections.find(c => c.id === slotProps.data.tipocolleccion_id)?.nombre || '—' }}
          </template>
        </Column>
        <Column field="estado" header="Estado" sortable style="min-width: 12rem"></Column>
        <Column header="Publicado?" style="width: 8rem; text-align: center;">
          <template #body="slotProps">
            <i
              :class="['pi', {
                'pi-check-circle text-green-500': slotProps.data.is_published,
                'pi-times-circle text-red-500': !slotProps.data.is_published
              }]"
              style="font-size: 1.5rem;"
            ></i>
          </template>
        </Column>

        <Column header="Acciones" bodyStyle="text-align: center; width: 8rem">
          <template #body="slotProps">
            <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editProduct(slotProps.data)" />
            <Button icon="pi pi-trash" class="p-button-rounded p-button-danger" @click="confirmDeleteProduct(slotProps.data)" />
            <Button
              :label="slotProps.data.is_published ? 'Despublicar' : 'Publicar'"
              :severity="slotProps.data.is_published ? 'danger' : 'success'"
              class="mr-2"
              @click="togglePublishStatus(slotProps.data.id)"
            />
          </template>
        </Column>
      </DataTable>

      <!-- ✅ Dialog Crear/Editar -->
     <Dialog v-model:visible="productDialog" header="Pieza" modal :style="{ width: '750px' }">
  <div class="p-fluid grid formgrid">

    <!-- ✅ Tipo Colección -->
    <div class="field col-12">
      <label for="tipocolleccion_id" class="font-bold">Tipo Colección</label>
      <Dropdown id="tipocolleccion_id" v-model="product.tipocolleccion_id"
                :options="collections"
                optionLabel="nombre"
                optionValue="id"
                placeholder="Seleccione una colección" class="w-full" />
    </div>

    <!-- 🔹 Datos Taxonómicos -->
    <div class="col-12">
      <h3 class="text-lg font-semibold mt-3 mb-2">Datos Taxonómicos</h3>
    </div>

    <div class="field col-6" v-for="field in ['familia','genero','especie','numeroCatalogo','colector','numeroColector','reino','division','clase','orden','determinador']" :key="field">
      <span class="p-float-label">
        <InputText :id="field" v-model="product[field]" class="w-full" />
        <label :for="field">{{ field }}</label>
      </span>
    </div>

    <!-- 🔹 Datos Geográficos -->
    <div class="col-12">
      <h3 class="text-lg font-semibold mt-3 mb-2">Datos Geográficos</h3>
    </div>

    <div class="field col-6" v-for="field in ['pais','departamento','municipio','localidad','altitud','latitud','datumGeodesico']" :key="field">
      <span class="p-float-label">
        <InputText :id="field" v-model="product[field]" class="w-full" />
        <label :for="field">{{ field }}</label>
      </span>
    </div>

    <!-- 🔹 Fecha de colección -->
    <div class="field col-6">
      <span class="p-float-label">
        <Calendar id="fechaColeccion" v-model="product.fechaColeccion" dateFormat="yy-mm-dd" showIcon class="w-full" />
        <label for="fechaColeccion">Fecha de Colección</label>
      </span>
    </div>

    <!-- 🔹 Imagen -->
    <div class="col-12 mt-4">
      <h3 class="text-lg font-semibold mb-2">Imagen</h3>
      <input type="file" ref="fileupload" accept="image/*" class="mb-3" />
      <div v-if="product.imagen_url" class="mt-2">
        <p><b>Imagen actual:</b></p>
        <img :src="product.imagen_url" alt="Imagen existente" style="max-width: 200px; border-radius: 8px;" />
        <Button label="Quitar imagen" icon="pi pi-times" severity="danger" size="small" class="mt-2" @click="removeImage" />
      </div>
    </div>

    <!-- 🔹 Estado -->
    <div class="field col-6">
      <label for="estado" class="block font-bold mb-2">Estado</label>
      <select v-model.number="product.estado" class="w-full p-inputtext p-component"> <option disabled value="">Seleccione un estado</option> <option :value="1">Activo</option> <option :value="0">Inactivo</option> </select>
    </div>
  </div>

  <!-- ✅ Footer con botones -->
  <template #footer>
    <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
    <Button label="Guardar" icon="pi pi-check" class="p-button-text" @click="saveProduct" />
  </template>
</Dialog>

      <!-- ✅ Dialog Eliminar 1 -->
      <Dialog v-model:visible="deleteProductDialog" header="Confirmar" modal :style="{ width: '450px' }">
        <div class="confirmation-content">
          <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem;" />
          <span>¿Está seguro de que desea eliminar la pieza <b>{{ product.familia }}</b>?</span>
        </div>
        <template #footer>
          <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteProductDialog = false" />
          <Button label="Sí" icon="pi pi-check" class="p-button-text" @click="deleteProduct" />
        </template>
      </Dialog>

      <!-- ✅ Dialog Eliminar Seleccionados -->
      <Dialog v-model:visible="deleteProductsDialog" header="Confirmar" modal :style="{ width: '450px' }">
        <div class="confirmation-content">
          <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem;" />
          <span>¿Está seguro de que desea eliminar las piezas seleccionadas?</span>
        </div>
        <template #footer>
          <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteProductsDialog = false" />
          <Button label="Sí" icon="pi pi-check" class="p-button-text" @click="deleteSelectedProducts" />
        </template>
      </Dialog>



      <!-- ✅ Dialog Ver Detalles -->
      <Dialog v-model:visible="viewDialog" header="Detalles de la Pieza" modal :style="{ width: '700px' }">
        <div class="p-fluid">
          <p><b>ID:</b> {{ selectedProduct.id }}</p>
          <p><b>Colección a la que pertenece:</b> {{ collections.find(c => c.id === selectedProduct.tipocolleccion_id)?.nombre || '—' }}</p>
          <p><b>Familia:</b> {{ selectedProduct.familia }}</p>
          <p><b>Género:</b> {{ selectedProduct.genero }}</p>
          <p><b>Especie:</b> {{ selectedProduct.especie }}</p>
          <p><b>Número Catálogo:</b> {{ selectedProduct.numeroCatalogo }}</p>
          
          <p><b>Colector:</b> {{ selectedProduct.colector }}</p>
          <p><b>Número Colector:</b> {{ selectedProduct.numeroColector }}</p>
          <p><b>Fecha de Colección:</b> {{ formatDate(selectedProduct.fechaColeccion) }}</p>
          <p><b>País:</b> {{ selectedProduct.pais }}</p>
          <p><b>Departamento:</b> {{ selectedProduct.departamento }}</p>
          <p><b>Municipio:</b> {{ selectedProduct.municipio }}</p>
          <p><b>Localidad:</b> {{ selectedProduct.localidad }}</p>
          <p><b>Altitud:</b> {{ selectedProduct.altitud }}</p>
          <p><b>Latitud:</b> {{ selectedProduct.latitud }}</p>
          <p><b>Datum Geodésico:</b> {{ selectedProduct.datumGeodesico }}</p>
          <p><b>Estado:</b> {{ selectedProduct.estado }}</p>
          <p><b>Imagen:</b></p>
          <div v-if="selectedProduct.imagen_url" class="mt-3">
            <img :src="selectedProduct.imagen_url" alt="Imagen de la pieza" style="max-width: 300px; border-radius: 8px;" />
          </div>
        </div>

        <template #footer>
          <Button label="Cerrar" icon="pi pi-times" class="p-button-text" @click="viewDialog = false" />
        </template>
      </Dialog>
    </div>
  </div>
</template>
