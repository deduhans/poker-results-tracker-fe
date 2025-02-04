<template>
    <v-menu>
        <template v-slot:activator="{ props }">
            <v-btn icon="mdi-dots-vertical" variant="text" v-bind="props"></v-btn>
        </template>
        <v-list>
            <v-list-item>
                <v-btn @click="logout">Logout</v-btn>
            </v-list-item>
        </v-list>
    </v-menu>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router';

const router = useRouter();
const userStore = useUserStore();

const logout = () => {
    userStore.clearUser();
    router.push({ name: "welcome" });
}
</script>