<script setup>
import { ref, onMounted } from "vue";
import { FilterMatchMode } from "@primevue/core/api";
import { useToast } from "primevue/usetoast";
import axios from "axios";

const toast = useToast();

const products = ref([]);
const productDialog = ref(false);
const deleteProductDialog = ref(false);
const deleteProductsDialog = ref(false);
const product = ref({});
const selectedProducts = ref([]);
const submitted = ref(false);

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

// ✅ listar colecciones
async function listarTodo(pagina = 1, numero_registros = 10) {
  try {
    const response = await axios.get("http://127.0.0.1:8000/api/tipocollecciones", {
      params: {
        pagina,
        numero_items: numero_registros,
      },
    });

    // Si tu backend devuelve {data: [...], ...}
    products.value = response.data.data ?? response.data; // Ajusta esto si tu paginador de Laravel usa otra clave
  } catch (err) {
    console.error(err.response?.data || err);
  }
}


onMounted(() => listarTodo(1, 10)); 


// ✅ abrir modal nuevo
function openNew() {
    // 🛑 CAMBIO CLAVE: Inicializar id a null para indicar creación
    product.value = { 
        id: null, 
        estado: 1, // Usar 1/0 en lugar de "Activo"/"Inactivo"
        // Inicializa aquí todos los demás campos requeridos a un valor vacío o por defecto
        nombre: null, acronimo: null, registro: null, 
        entidad: null, pais: 'Colombia', departamento: 'Cordoba', ciudad: 'Monteria',
        // Inicializa campos de auditoría si son requeridos por el FormRequest
        usuariocreacion: 'DEFAULT', usuariomodificacion: 'DEFAULT', 
        ipcreacion: '127.0.0.1', ipmodificacion: '127.0.0.1' 
    };
    submitted.value = false;
    productDialog.value = true;
}

// ✅ editar
function editProduct(p) {
  product.value = { ...p };
  productDialog.value = true;
}

// ✅ ocultar modal
function hideDialog() {
  productDialog.value = false;
  submitted.value = false;
}

// ✅ guardar/actualizar
// ✅ guardar/actualizar
async function saveProduct() {
    submitted.value = true;
    // ... (Tu validación básica del frontend)

    try {
        const isCreating = !product.value.id; // true si id es null/undefined
        
        // 📦 Armamos payload base (TODOS los campos requeridos)
        const payload = {
            nombre: product.value.nombre,
            acronimo: product.value.acronimo,
            registro: product.value.registro,
            entidad: product.value.entidad,
            pais: product.value.pais,
            departamento: product.value.departamento,
            ciudad: product.value.ciudad,
            estado: Number(product.value.estado),
            
            // Incluye los campos de auditoría con valores por defecto si están vacíos
            usuariocreacion: product.value.usuariocreacion || 'DEFAULT', 
            usuariomodificacion: product.value.usuariomodificacion || 'DEFAULT',
            ipcreacion: product.value.ipcreacion || '127.0.0.1',
            ipmodificacion: product.value.ipmodificacion || '127.0.0.1',
        };

        let res;
        
        if (isCreating) {
            // CREAR: POST a la ruta base. No incluir el ID en el payload.
            res = await axios.post("http://127.0.0.1:8000/api/tipocollecciones", payload);
        } else {
            // ACTUALIZAR: PUT a la ruta con el ID.
            // Para actualizar, tu controlador espera el ID en la URL y en el cuerpo.
            payload.id = parseInt(product.value.id); // Agrega el ID para la actualización
            res = await axios.put(
                `http://127.0.0.1:8000/api/tipocollecciones/${product.value.id}`,
                payload
            );
        }

        // ... (Mensaje de éxito y cierre del modal)
        toast.add({
             // ...
        });

        productDialog.value = false;
        listarTodo(); // Llamar a la función correcta para recargar

    } catch (err) {
        // ... (Manejo de errores)
    }
}


// ✅ confirmar eliminar uno
function confirmDeleteProduct(p) {
  product.value = p;
  deleteProductDialog.value = true;
}

// ✅ eliminar uno
async function deleteProduct() {
  try {
    await axios.delete(`http://127.0.0.1:8000/api/tipocollecciones/${product.value.id}`);

    products.value = products.value.filter((val) => val.id !== product.value.id);
    deleteProductDialog.value = false;
    product.value = {};

    toast.add({
      severity: "success",
      summary: "Éxito",
      detail: "Colección eliminada",
      life: 3000,
    });
  } catch (err) {
    console.error(err);
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "No se pudo eliminar",
      life: 3000,
    });
  }
}

// ✅ confirmar eliminar múltiples
function confirmDeleteSelected() {
  deleteProductsDialog.value = true;
}

// ✅ eliminar múltiples
async function deleteSelectedProducts() {
  try {
    const ids = selectedProducts.value.map((p) => p.id);

    await axios.post("http://127.0.0.1:8000/api/tipocollecciones/eliminar", {
      array_ids: ids,
    });

    products.value = products.value.filter((p) => !ids.includes(p.id));
    deleteProductsDialog.value = false;
    selectedProducts.value = [];

    toast.add({
      severity: "success",
      summary: "Éxito",
      detail: "Colecciones eliminadas",
      life: 3000,
    });
  } catch (err) {
    console.error(err);
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "No se pudieron eliminar",
      life: 3000,
    });
  }
}





/* function findIndexById(id) {
    let index = -1;
    for (let i = 0; i < products.value.length; i++) {
        if (products.value[i].id === id) {
            index = i;
            break;
        }
    }

    return index;
}

function createId() {
    let id = '';
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 5; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
} */

/* function exportCSV() {
    dt.value.exportCSV();
}
 */
/* function confirmDeleteSelected() {
    deleteProductsDialog.value = true;
} */

/* function deleteSelectedProducts() {
    products.value = products.value.filter((val) => !selectedProducts.value.includes(val));
    deleteProductsDialog.value = false;
    selectedProducts.value = null;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
}

function getStatusLabel(status) {
    switch (status) {
        case 'INSTOCK':
            return 'success';

        case 'LOWSTOCK':
            return 'warn';

        case 'OUTOFSTOCK':
            return 'danger';

        default:
            return null;
    }
} */
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

            <DataTable
               ref="dt"
                v-model:selection="selectedProducts"
                :value="products"
                dataKey="id"
                :paginator="true"
                :rows="10"
                :filters="filters"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]"
                currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} colecciones"
            >
                <template #header>
                    <div class="flex flex-wrap gap-2 items-center justify-between">
                        <h4 class="m-0">Lista de Colecciones</h4>
                        <IconField>
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="filters['global'].value" placeholder="Search..." />
                        </IconField>
                    </div>
                </template>

                <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
                <Column field="id" header="ID" sortable style="min-width: 8rem"></Column>
                <Column field="nombre" header="Nombre" sortable style="min-width: 12rem"></Column>
                <Column field="acronimo" header="Acronimo" sortable style="min-width: 16rem"></Column>
                <Column field="registro" header="Registro" sortable></Column>
                <Column field="entidad" header="Entidad" sortable></Column>
                <Column field="pais" header="Pais" sortable style="min-width: 10rem"></Column>
                <Column field="departamento" header="Departamento" sortable style="min-width: 12rem"></Column>
                <Column field="ciudad" header="Ciudad" sortable style="min-width: 12rem"></Column>
                <Column field="estado" header="Estado" sortable style="min-width: 12rem"></Column>
                <Column field="usuariocreacion" header="Usuario Creación" sortable style="min-width: 12rem"></Column>
                <Column field="usuariomodificacion" header="Usuario Modificación" sortable style="min-width: 12rem"></Column>
                <Column field="ipmodificacion" header="IP Modificación" sortable style="min-width: 12rem"></Column>
                <Column field="ipcreacion" header="IP Creación" sortable style="min-width: 12rem"></Column>
                <Column :exportable="false" style="min-width: 12rem">
                    <template #body="slotProps">
                        <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editProduct(slotProps.data)" />
                        <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteProduct(slotProps.data)" />
                    </template>
                </Column>
            </DataTable>
        </div>

        <Dialog v-model:visible="productDialog" :style="{ width: '450px' }" header="Agregar de coleccion" :modal="true">
            <div class="flex flex-col gap-4">
                <div>
                    <label for="id" class="block font-bold mb-2">ID</label>
                    <InputNumber id="id" v-model="product.id" :disabled="product.id > 0" />
                    <small v-if="submitted && !product.id" class="text-red-500">ID es requerido.</small>
                </div>
                <div>
                    <label for="nombre" class="block font-bold mb-2">Nombre</label>
                    <InputText id="nombre" v-model.trim="product.nombre" required autofocus :invalid="submitted && !product.nombre" fluid />
                    <small v-if="submitted && !product.nombre" class="text-red-500">Nombre es requerido.</small>
                </div>
                <div>
                    <label for="acronimo" class="block font-bold mb-2">Acrónimo</label>
                    <InputText id="acronimo" v-model.trim="product.acronimo" fluid />
                </div>
                <div>
                    <label for="registro" class="block font-bold mb-2">Registro</label>
                    <InputText id="registro" v-model.trim="product.registro" fluid />
                </div>
                <div>
                    <label for="entidad" class="block font-bold mb-2">Entidad</label>
                    <InputText id="entidad" v-model.trim="product.entidad" fluid />
                </div>
                <div>
                    <label for="pais" class="block font-bold mb-2">País</label>
                    <select id="pais" v-model="product.pais" class="w-full p-inputtext p-component p-filled" >
                        <option value="" disabled>Seleccione un país</option>
                        <option value="Colombia">Colombia</option>
                        <option value="Argentina">Argentina</option>
                        <option value="Chile">Chile</option>
                    </select>
                </div>
                <div>
                    <label for="departamento" class="block font-bold mb-2">Departamento</label>
                    <select id="departamento" v-model="product.departamento" class="w-full p-inputtext p-component p-filled" >
                        <option value="" disabled>Seleccione un departamento</option>
                        <option value="Cordoba">Cordoba</option>
                        <option value="Cundinamarca">Cundinamarca</option>
                        <option value="Valle del Cauca">Valle del Cauca</option>
                    </select>
                    </div>
                <div>
                    <label for="ciudad" class="block font-bold mb-2">Ciudad</label>
                    <select id="ciudad" v-model="product.ciudad" class="w-full p-inputtext p-component p-filled" >
                        <option value="" disabled>Seleccione una ciudad</option>
                        <option value="Monteria">Monteria</option>
                        <option value="Bogota">Bogota</option>
                        <option value="Cali">Cali</option>
                    </select>
                </div>
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
    <Button label="Cancelar" icon="pi pi-times" text @click="hideDialog" />
    <Button label="Guardar" icon="pi pi-check" @click="saveProduct" type="button" />

</template>

        </Dialog>

        <Dialog v-model:visible="deleteProductDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="product"
                    >¿Estas seguro en borrar esta Colección? <b>{{ product.nombre }}</b
                    >?</span
                >
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteProductDialog = false" />
                <Button label="Yes" icon="pi pi-check" @click="deleteProduct" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteProductsDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="product">Estas seguro de eliminar estas colecciones?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteProductsDialog = false" />
                <Button label="Yes" icon="pi pi-check" text @click="deleteSelectedProducts" />
            </template>
        </Dialog>
    </div>
</template>
