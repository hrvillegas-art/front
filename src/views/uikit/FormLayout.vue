<script setup>
import { ref } from 'vue';
import axios from 'axios'


const formData = ref({
    nombre: '',
    acronimo: '',
    registro: '',
    entidad: '',
    pais: '',
    departamento: '',
    ciudad: ''
})

const submitForm = async () => {
    try {
        const response = await axios.post('http://127.0.0.1:8000/api/tipocollecciones/', {

            nombre: formData.value.nombre,
            acronimo: formData.value.acronimo,
            registro: formData.value.registro,
            entidad: formData.value.entidad,
            pais: formData.value.pais,
            departamento: formData.value.departamento,
            ciudad: formData.value.ciudad
        })

        mensaje.value = response.data.message
        nombre.value = ''
        acronimo.value = ''
        registro.value = ''
        entidad.value = ''
        pais.value = ''
        departamento.value = ''
        ciudad.value = ''
    } catch (error) {
        mensaje.value = 'Error submitting form'
        console.error(error)
    }
}
</script>

<template>
    <Fluid>
        <div class="flex flex justify-center yesflex-col md:flex-row gap-8" >
            <div class="md:w-1/2">
                <div class="card flex flex-col gap-4">
                    <div class="font-semibold text-xl">Agregar tipos de Colección </div>
                    <div class="flex flex-col gap-2">
                        <label for="nombre">Nombre de la colección</label>
                        <InputText id="nombre"  type="text" v-model="formData.nombre"/>
                    </div>
                    <div class="flex flex-col gap-2">
                        <label for="acronimo">Acronimo</label>
                        <InputText id="acronimo" type="text" v-model="formData.acronimo"/>
                    </div>
                    <div class="flex flex-col gap-2">
                        <label for="registro">Registro de la Colección</label>
                        <InputText id="registro" type="text" v-model="formData.registro" />
                    </div>
                    <div class="flex flex-col gap-2">
                        <label for="entidad">Entidad</label>
                        <InputText id="entidad" type="text" v-model="formData.entidad" />
                    </div>
                    <div class="flex flex-col gap-2">
                        <label for="pais">Pais</label>
                        <InputText id="pais" type="text" v-model="formData.pais"/>
                    </div>
                     <div class="flex flex-col gap-2">
                        <label for="departamento">Departamento</label>
                        <InputText id="departamento" type="text" v-model="formData.departamento"/>
                    </div>
                     <div class="flex flex-col gap-2">
                        <label for="pais">Ciudad</label>
                        <InputText id="ciudad" type="text" v-model="formData.ciudad"/>
                    </div>
                    <Button label="Enviar" :fluid="false" @click="submitForm" />
                </div>
 
                <!-- <div class="card flex flex-col gap-4">
                    <div class="font-semibold text-xl">Vertical Grid</div>
                    <div class="flex flex-wrap gap-4">
                        <div class="flex flex-col grow basis-0 gap-2">
                            <label for="name2">Name</label>
                            <InputText id="name2" type="text" />
                        </div>
                        <div class="flex flex-col grow basis-0 gap-2">
                            <label for="email2">Email</label>
                            <InputText id="email2" type="text" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="md:w-1/2">
                <div class="card flex flex-col gap-4">
                    <div class="font-semibold text-xl">Horizontal</div>
                    <div class="grid grid-cols-12 gap-2">
                        <label for="name3" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0">Name</label>
                        <div class="col-span-12 md:col-span-10">
                            <InputText id="name3" type="text" />
                        </div>
                    </div>
                    <div class="grid grid-cols-12 gap-2">
                        <label for="email3" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0">Email</label>
                        <div class="col-span-12 md:col-span-10">
                            <InputText id="email3" type="text" />
                        </div>
                    </div> -->
                </div>

                <!-- <div class="card flex flex-col gap-4"> -->
                    <!-- div class="font-semibold text-xl">Inline</div>
                    <div class="flex flex-wrap items-start gap-4">
                        <div class="field">
                            <label for="firstname1" class="sr-only">Firstname</label>
                            <InputText id="firstname1" type="text" placeholder="Firstname" />
                        </div>
                        <div class="field">
                            <label for="lastname1" class="sr-only">Lastname</label>
                            <InputText id="lastname1" type="text" placeholder="Lastname" />
                        </div>
                        <Button label="Submit" :fluid="false"></Button>
                    </div>
                </div>
                <div class="card flex flex-col gap-4">
                    <div class="font-semibold text-xl">Help Text</div>
                    <div class="flex flex-wrap gap-2">
                        <label for="username">Username</label>
                        <InputText id="username" type="text" />
                        <small>Enter your username to reset your password.</small>
                    </div>
                </div>
            </div>
        </div>

        <div class="flex mt-8">
            <div class="card flex flex-col gap-4 w-full">
                <div class="font-semibold text-xl">Advanced</div>
                <div class="flex flex-col md:flex-row gap-4">
                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="firstname2">Firstname</label>
                        <InputText id="firstname2" type="text" />
                    </div>
                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="lastname2">Lastname</label>
                        <InputText id="lastname2" type="text" />
                    </div>
                </div>

                <div class="flex flex-wrap">
                    <label for="address">Address</label>
                    <Textarea id="address" rows="4" />
                </div>

                <div class="flex flex-col md:flex-row gap-4">
                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="state">State</label>
                        <Select id="state" v-model="dropdownItem" :options="dropdownItems" optionLabel="name" placeholder="Select One" class="w-full"></Select>
                    </div>
                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="zip">Zip</label>
                        <InputText id="zip" type="text" />
                -->    </div>
    </Fluid>
</template>
