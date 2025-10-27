<script setup>
import axios from "axios"; // Usamos Axios, el estándar moderno
import { ref } from "vue";


axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:8000'; // Asegúrate de que esta URL sea la de tu backend

const username = ref("");
const password = ref("");
const loading = ref(false);
const errorMessage = ref(null);


async function Login() {
    loading.value = true;
    errorMessage.value = null;

    const usuario = username.value;
    const clave = password.value;

    try {
        // ----------------------------------------------------
        // PASO 1: Obtener la Cookie CSRF de Sanctum (¡CLAVE!)
        // ----------------------------------------------------
        // await axios.get("/sanctum/csrf-cookie");
        // console.log("Cookie CSRF obtenida con éxito.");
        
        // ----------------------------------------------------
        // PASO 2: Intentar el Login
        // ----------------------------------------------------
        const response = await axios.post("/api/loginapi", {
            username: usuario,
            password: clave,
        }, {
            // No es estrictamente necesario repetir el withCredentials aquí si ya está global, 
            // pero no hace daño.
            xhrFields: { withCredentials: true } 
        });

        const outserver = response.data;

        if (outserver.state === 202) {
            localStorage.clear(); // Limpia cualquier token viejo
            if (outserver.token) {
                // Guarda el token si tu API lo retorna (aunque la autenticación se hará por cookie)
                localStorage.setItem("token", outserver.token);
            }
            
            // Redireccionar a la página principal
            // Si usas Vue Router: router.push('/home');
            location.href = "/home"; 
        } else {
             // Esto realmente no debería pasar si el servidor retorna 202 en éxito.
             errorMessage.value = "Respuesta de servidor inesperada.";
        }

    } catch (error) {
        console.error("Error en el login:", error);

        // Manejar errores de validación (422) o credenciales (404/401)
        if (error.response) {
            const status = error.response.status;
            
            if (status === 422) {
                errorMessage.value = "Campos incompletos.";
            } else if (status === 404 || status === 401) {
                // Asumiendo que tu LoginController retorna 404 para credenciales incorrectas.
                errorMessage.value = "Credenciales incorrectas.";
            } else {
                errorMessage.value = `Error ${status}: Problema con la solicitud al servidor.`;
            }
        } else {
            // Error de red, fallo del servidor, o el temido error de CORS (si no se limpió bien)
            errorMessage.value = "No se pudo conectar al servidor. Verifique que el backend de Laravel esté corriendo y libre de conflictos CORS.";
        }

    } finally {
        loading.value = false;
    }
}
</script>

<template>
<div class="max-w-sm mx-auto p-6 bg-white rounded-lg shadow">
    <h2 class="text-2xl font-bold text-center mb-4">Login</h2>

    <form @submit.prevent="Login">
        <input v-model="username" placeholder="Usuario" class="w-full p-2 border rounded mb-2" required/>
        <input v-model="password" type="password" placeholder="Contraseña" class="w-full p-2 border rounded mb-4" required/>

        <button type="submit" :disabled="loading" class="w-full bg-blue-600 text-white p-2 rounded">
            {{ loading ? "Ingresando..." : "Ingresar" }}
        </button>
    </form>

    <div v-if="loading" class="text-center mt-2">Cargando...</div>
    <p v-if="errorMessage" class="text-red-500 mt-2 text-center">
        <strong>{{ errorMessage }}</strong>
    </p>
</div>
</template>

<style scoped>
/* Agrega estilos si es necesario */
</style>