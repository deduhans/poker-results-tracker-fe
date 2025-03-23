<template>
    <v-menu activator="parent">
        <template v-slot:activator="{ props }">
            <v-btn icon="mdi-dots-vertical" variant="text" v-bind="props"></v-btn>
        </template>
        <v-list>
            <v-list-item>
                <v-list-item-title>
                    <v-btn 
                        variant="text" 
                        :prepend-icon="themeStore.isDark ? 'mdi-weather-sunny' : 'mdi-weather-night'"
                        @click="themeStore.toggleTheme"
                    >
                        {{ themeStore.isDark ? 'Light Mode' : 'Dark Mode' }}
                    </v-btn>
                </v-list-item-title>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item
                @click="logout"
            >
                <v-list-item-title>Logout</v-list-item-title>
            </v-list-item>
        </v-list>
    </v-menu>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/stores/user';
import { useThemeStore } from '@/stores/theme';
import { useRouter } from 'vue-router';
import LogoutController from '@/network/lib/auth';

const logoutController = new LogoutController();
const router = useRouter();
const userStore = useUserStore();
const themeStore = useThemeStore();

const logout = () => {
  logoutController.logout();
  userStore.clearUser();
  router.push({ name: 'login' });
};
</script>