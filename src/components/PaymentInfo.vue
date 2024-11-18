<template>
    <v-card class="mb-2">
        <v-row>
            <v-card-text class="text-left">{{ playerName }}</v-card-text>
            <v-card-text>{{ amount }}</v-card-text>
            <v-card-text class="text-right">{{ date }}</v-card-text>
        </v-row>
    </v-card>
</template>

<script lang="ts" setup>

defineProps<{
    playerName: string,
    amount: number,
    date: string,
}>();

</script>
