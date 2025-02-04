<template>
    <v-app-bar>
        <template v-slot:prepend>
            <v-btn icon="mdi-arrow-left" @click="redirectBack()"></v-btn>
        </template>

        <v-app-bar-title>{{ userStore.userName }}</v-app-bar-title>

        <template v-slot:append>
            <OverflowMenu />
        </template>
    </v-app-bar>
</template>

<script lang="ts" setup>
import { useUserStore } from "@/stores/user";
import { useRouter } from "vue-router";
import OverflowMenu from "@/components/OverflowMenu.vue";

const router = useRouter();
const userStore = useUserStore();

const redirectBack = () => {
    router.back();
}
</script>

<style></style>