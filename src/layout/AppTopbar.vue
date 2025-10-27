<template>
  <div class="layout-topbar">
    <div class="layout-topbar-logo-container">
      <!-- 🔸 Botón hamburguesa eliminado (estaba aquí)
      <button class="layout-menu-button layout-topbar-action" @click="toggleMenu">
        <i class="pi pi-bars"></i>
      </button>
      -->

      <!-- Logo -->
      <router-link to="/" class="layout-topbar-logo">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/9/9e/Escudo_Universidad_de_C%C3%B3rdoba.png"
          alt="Logo"
          class="logo-img"
        />
        <span class="logo-text">Museo Unicor</span>
      </router-link>
    </div>

    <div class="layout-topbar-actions">
      <div class="layout-config-menu flex items-center gap-4">
        <!-- Botón modo oscuro -->
        <button type="button" class="layout-topbar-action" @click="toggleDarkMode">
          <i :class="['pi', { 'pi-moon': isDarkTheme, 'pi-sun': !isDarkTheme }]"></i>
        </button>

        <!-- Menú de navegación (solo si está logueado y no es página pública) -->
        <nav
          v-if="isAuthenticated && !isPublicPage"
          class="flex items-center gap-4"
        >
          <router-link to="/pages/crud" class="nav-link">Colecciones</router-link>
          <router-link to="/pages/crud2" class="nav-link">Carreras con colecciones</router-link>
          <router-link to="/pages/crud3" class="nav-link">Piezas</router-link>
          <router-link to="/estadisticas" class="nav-link">Estadísticas</router-link>

          <button class="logout-btn" @click="logout">
            <i class="pi pi-sign-out"></i> Salir
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useLayout } from '@/layout/composables/layout'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import { ref, onMounted, computed, watch } from 'vue'

const { toggleDarkMode, isDarkTheme } = useLayout()
const router = useRouter()
const route = useRoute()

// Estado de autenticación
const isAuthenticated = ref(false)

// Detectar si la ruta es pública
const isPublicPage = computed(() => {
  const publicRoutes = ['/catalogo']
  const path = route.path
  return publicRoutes.includes(path) || /^\/piezas\/\d+$/.test(path)
})

onMounted(() => {
  isAuthenticated.value = !!localStorage.getItem('token')
})

// Escuchar cambios de ruta
watch(
  () => route.path,
  () => {
    isAuthenticated.value = !!localStorage.getItem('token')
  }
)

// Cerrar sesión
const logout = async () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('No se encontró token de sesión')

    await axios.post(
      'http://127.0.0.1:8000/api/logout',
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    )

    localStorage.removeItem('token')
    localStorage.removeItem('user')

    isAuthenticated.value = false
    router.push('/auth/login')
  } catch (error) {
    console.error('Error cerrando sesión:', error)
    alert('No se pudo cerrar sesión.')
  }
}
</script>

<style scoped>
.layout-topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1.5rem;
  background-color: var(--surface-a);
  border-bottom: 1px solid var(--surface-border);
}

.layout-topbar-logo-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.layout-topbar-logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
}

.logo-img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.logo-text {
  font-weight: 700;
  font-size: 1.25rem;
  color: var(--text-color);
}

.nav-link {
  color: var(--text-color);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
}

.nav-link:hover {
  color: var(--primary-color);
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  background-color: #e63946;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.4rem 0.8rem;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s ease;
}

.logout-btn:hover {
  background-color: #c72c37;
}
</style>
