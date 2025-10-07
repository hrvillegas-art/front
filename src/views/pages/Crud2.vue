<script setup>
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';
import axios from 'axios';

const toast = useToast();
const dt = ref();
const products = ref([]);
const productDialog = ref(false);
const deleteProductDialog = ref(false);
const deleteProductsDialog = ref(false);
const product = ref({});
const selectedProducts = ref();
const submitted = ref(false);
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

// 👉 aquí guardamos los tipos de colección
const tiposColeccion = ref([]);

onMounted(() => {
    getProducts();
    getTiposColeccion(); // también cargamos tipos
});

async function getProducts() {
    const res = await axios.get('http://127.0.0.1:8000/api/collecciones');
    products.value = res.data.data;
}

async function getTiposColeccion() {
    const res = await axios.get('http://127.0.0.1:8000/api/tipocollecciones');
    tiposColeccion.value = res.data.data; // debe devolver [{id:1, nombre:"X"}, ...]
}

// En <script setup>

function openNew() {
    product.value = {
        nombre: '',
        descripcion: '',
        // ✅ Inicializar como null o undefined, no como string vacío
        tipocolleccion_id: null 
    };
    submitted.value = false;
    productDialog.value = true;
}

function hideDialog() {
    productDialog.value = false;
    submitted.value = false;
}

// En <script setup>

async function saveProduct() {
    submitted.value = true;

    // Asegurar que todos los campos requeridos estén presentes y sean válidos
    if (product.value.nombre.trim() && product.value.tipocolleccion_id !== null) { 
        try {
            if (product.value.id) {
                // ... Lógica de Actualización (PUT)
                await axios.put(`http://127.0.0.1:8000/api/collecciones/${product.value.id}`, product.value);
                toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
            } else {
                // Lógica de Creación (POST)
                let res = await axios.post(`http://127.0.0.1:8000/api/collecciones`, product.value);
                
                // 🛑 ELIMINAR ESTA LÍNEA 
                // products.value.push(res.data.data); 
                
                toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
            }

            productDialog.value = false;
            product.value = {};
            
            // ✅ LLAMAR A getProducts() AQUÍ UNA VEZ para refrescar la lista.
            // Si tu getProducts es simple, esta es la forma más segura.
            getProducts(); 

        } catch (error) {
            console.error("❌ Error al guardar:", error.response?.data || error);
            toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar', life: 3000 });
        }
    }
}

function editProduct(productData) {
    product.value = { ...productData };
    productDialog.value = true;
}

function confirmDeleteProduct(productData) {
    product.value = { ...productData };
    deleteProductDialog.value = true;
}

async function deleteProduct() {
    await axios.delete(`http://127.0.0.1:8000/api/collecciones/${product.value.id}`);
    products.value = products.value.filter((val) => val.id !== product.value.id);
    deleteProductDialog.value = false;
    product.value = {};
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
    getProducts();
}

function confirmDeleteSelected() {
    deleteProductsDialog.value = true;
}

async function deleteSelectedProducts() {
    for (let prod of selectedProducts.value) {
        await axios.delete(`http://127.0.0.1:8000/api/collecciones/${prod.id}`);
    }
    products.value = products.value.filter((val) => !selectedProducts.value.includes(val));
    deleteProductsDialog.value = false;
    selectedProducts.value = null;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
    getProducts();
}
</script>

<template>
    <div>
        <div class="card">
            <Toolbar class="mb-6">
                <template #start>
                    <Button label="Nuevo" icon="pi pi-plus" severity="secondary" class="mr-2" @click="openNew" />
                    <Button label="Eliminar" icon="pi pi-trash" severity="secondary" @click="confirmDeleteSelected" :disabled="!selectedProducts || !selectedProducts.length" />
                </template>
            </Toolbar>
        </div>

        <div class="card">
            <DataTable
                ref="dt"
                :value="products"
                selectionMode="multiple"
                v-model:selection="selectedProducts"
                :filters="filters"
                dataKey="id"
                paginator
                rows="10"
                :rowsPerPageOptions="[5, 10, 25]"
                :globalFilterFields="['nombre', 'descripcion', 'tipocolleccion_id']"
                responsiveLayout="scroll"
            >
                <Column selectionMode="multiple" headerStyle="width: 3em"></Column>
                <Column field="nombre" header="Tipo de Coleccion" sortable></Column>
                <Column field="descripcion" header="Descripción" sortable></Column>
               <Column header="Colección" sortable>
  <template #body="slotProps">
    {{
      tiposColeccion.find(t => t.id === slotProps.data.tipocolleccion_id)?.nombre || 'N/A'
    }}
  </template>
</Column>
                <Column header="Acciones" bodyStyle="text-align: center;">
                    <template #body="slotProps">
                        <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editProduct(slotProps.data)" />
                        <Button icon="pi pi-trash" class="p-button-rounded p-button-danger" @click="confirmDeleteProduct(slotProps.data)" />
                    </template>
                </Column>
            </DataTable>

            <Dialog v-model:visible="productDialog" header="Detalles de Colección" modal :style="{ width: '450px' }" :closable="false">
                <div class="p-fluid">
                    <div class="field">
                        <label for="nombre">Nombre</label>
                        <InputText id="nombre" v-model="product.nombre" required autofocus :class="{ 'p-invalid': submitted && !product.nombre }" />
                        <small v-if="submitted && !product.nombre" class="p-error">Nombre es requerido.</small>
                    </div>
                    <div class="field">
                        <label for="descripcion">Descripción</label>
                        <InputText id="descripcion" v-model="product.descripcion" required />
                    </div>
                    <div class="field">
    <label for="tipocolleccion_id">Tipo Colección</label>
    <Dropdown
        id="tipocolleccion_id"
        v-model="product.tipocolleccion_id"
        :options="tiposColeccion"
        optionLabel="nombre"
        optionValue="id"
        placeholder="Seleccione un tipo"
        class="w-full"
        :class="{ 'p-invalid': submitted && !product.tipocolleccion_id }" /> <small v-if="submitted && !product.tipocolleccion_id" class="p-error">Tipo Colección es requerido.</small> </div>
        <div>
  <label for="estado" class="block font-bold mb-2">Estado</label>
  <select v-model.number="product.estado" class="w-full p-inputtext p-component">
  <option disabled value="">Seleccione un estado</option>
  <option :value="1">Activo</option>
  <option :value="0">Inactivo</option>
</select>


  <small v-if="submitted && !product.estado" class="text-red-500">Estado es requerido.</small>
</div>
                <div>
                    <label for="usuariocreacion" class="block font-bold mb-2">Usuario Creación</label>
                    <InputText id="usuariocreacion" v-model.trim="product.usuariocreacion" fluid />
                    <small v-if="submitted && !product.usuariocreacion" class="text-red-500">Usuario Creación es requerido.</small>
                    <small class="text-gray-500">Ingrese el nombre del usuario que creó el registro.</small>
                </div>
                <div>
                    <label for="usuariomodificacion" class="block font-bold mb-2">Usuario Modificación</label>
                    <InputText id="usuariomodificacion" v-model.trim="product.usuariomodificacion" fluid />
                    <small v-if="submitted && !product.usuariomodificacion" class="text-red-500">Usuario Modificación es requerido.</small>
                    <small class="text-gray-500">Ingrese el nombre del usuario que modificó el registro.</small>
                </div>
                <div>
                    <label for="ipcreacion" class="block font-bold mb-2">IP Creación</label>
                    <InputText id="ipcreacion" v-model.trim="product.ipcreacion" fluid />
                    <small v-if="submitted && !product.ipcreacion" class="text-red-500">IP Creación es requerido.</small>
                    <small class="text-gray-500">Ingrese la dirección IP desde donde se creó el registro.</small>
                </div>
                <div>
                    <label for="ipmodificacion" class="block font-bold mb-2">IP Modificación</label>
                    <InputText id="ipmodificacion" v-model.trim="product.ipmodificacion" fluid />
                    <small v-if="submitted && !product.ipmodificacion" class="text-red-500">IP Modificación es requerido.</small>
                    <small class="text-gray-500">Ingrese la dirección IP desde donde se modificó el registro.</small>
                </div>
                </div>
                <template #footer>
                    <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                    <Button label="Guardar" icon="pi pi-check" class="p-button-text" @click="saveProduct" />
                </template>
            </Dialog>

            <Dialog v-model:visible="deleteProductDialog" header="Confirmar" modal :style="{ width: '350px' }">
                <div class="confirmation-content">
                    <i class="pi pi-exclamation-triangle" style="font-size: 2rem" />
                    <span>¿Seguro que desea eliminar esta colección?</span>
                </div>
                <template #footer>
                    <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteProductDialog = false" />
                    <Button label="Sí" icon="pi pi-check" class="p-button-text" @click="deleteProduct" />
                </template>
            </Dialog>

            <Dialog v-model:visible="deleteProductsDialog" header="Confirmar" modal :style="{ width: '350px' }">
                <div class="confirmation-content">
                    <i class="pi pi-exclamation-triangle" style="font-size: 2rem" />
                    <span>¿Seguro que desea eliminar las colecciones seleccionadas?</span>
                </div>
                <template #footer>
                    <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteProductsDialog = false" />
                    <Button label="Sí" icon="pi pi-check" class="p-button-text" @click="deleteSelectedProducts" />
                </template>
            </Dialog>
        </div>
    </div>
</template>
