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

const roomStore = useRoomStore();
const userStore = useUserStore();

</script>