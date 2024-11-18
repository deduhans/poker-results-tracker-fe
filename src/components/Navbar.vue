<template>
    <v-app-bar>
        <template v-slot:prepend>
            <v-btn icon="mdi-arrow-left" v-if="!isHomeView()" @click="redirectBack()"></v-btn>
        </template>

        <v-app-bar-title>{{ userStore.userName }}</v-app-bar-title>

        <template v-slot:append>
            <OverflowMenu />
        </template>
    </v-app-bar>
</template>

<script lang="ts" setup>
import { useUserStore } from "@/stores/user";
import { useRoute, useRouter } from "vue-router";
import OverflowMenu from "@/components/OverflowMenu.vue";

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const isHomeView = () => {
    return route.name === "home";
};

const redirectBack = () => {
    router.back();
}
</script>

<style></style>