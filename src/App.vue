<template>
    <v-app>
        <Navbar v-if="userStore.userId" />
        <v-main>
            <router-view></router-view>
        </v-main>
    </v-app>
</template>

<script lang="ts" setup>
import Navbar from '@/components/Navbar.vue';
import { useUserStore } from '@/stores/user';
import { useRoomStore } from './stores/room';
import { useAuthStore } from '@/stores/auth';
import { onMounted } from 'vue';

const roomStore = useRoomStore();
const userStore = useUserStore();
const authStore = useAuthStore();

// Check if the user has a valid session on app load
onMounted(async () => {
  // If we have a valid session in the auth store, no need to check with backend
  if (authStore.isAuthenticated && authStore.isSessionValid) {
    return;
  }
  
  // Otherwise, initialize from backend
  await authStore.initializeAuth();
});
</script>