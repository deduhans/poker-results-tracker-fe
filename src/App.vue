<template>
    <v-app>
        <Navbar v-if="userStore.userId" />
        <v-main>
            <div v-if="userStore.userId">
                <router-view></router-view>
            </div>
            <div v-else>
                <SingUp />
            </div>
        </v-main>
    </v-app>
</template>

<script lang="ts" setup>
import Navbar from '@/components/Navbar.vue';
import SingUp from '@/views/SignUp.vue';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();

</script>