<script setup>
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();

const logout = async () => {
    try {
        await axios.post('/api/logout');
        router.push('/auth/login');
    } catch (error) {
        console.error('Error cerrando sesión:', error);
    }
};
</script>

<template>
    <button
        @click="logout"
        class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
    >
        Logout
    </button>
</template>
