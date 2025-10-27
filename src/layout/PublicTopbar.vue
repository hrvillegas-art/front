<template>
  <header class="public-topbar">
    <router-link to="/catalogo" class="logo">
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/9/9e/Escudo_Universidad_de_C%C3%B3rdoba.png"
        alt="Logo"
        class="logo-img"
      />
      <span class="title">Museo Unicor</span>
    </router-link>

    <nav class="menu">
      <router-link to="/catalogo" class="nav-link">Catálogo</router-link>
    </nav>
  </header>
</template>

<style scoped>
.public-topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background-color: #f8f9fa;
  border-bottom: 1px solid #ddd;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: #333;
}

.logo-img {
  width: 45px;
  height: 45px;
  border-radius: 50%;
}

.title {
  font-weight: 700;
  font-size: 1.2rem;
}

.nav-link {
  margin-left: 1rem;
  text-decoration: none;
  color: #333;
  font-weight: 500;
  transition: color 0.2s ease;
}

.nav-link:hover {
  color: #007bff;
}
</style>
