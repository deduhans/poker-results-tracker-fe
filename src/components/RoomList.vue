<template>
    <v-card class="my-3">
        <v-card-title>{{ listName }}</v-card-title>
        <v-container v-if="isListEmpty()" class="d-flex justify-center">
            <v-card-subtitle>There is no room yet</v-card-subtitle>
        </v-container>
        <v-list>
            <v-list-item v-for="room in rooms" :key="room.id" @click="handleRoomClick(room)" class="room-item">
                <v-list-item-title>{{ room.name }}</v-list-item-title>
                <v-list-item-subtitle>Id: {{ room.id }}</v-list-item-subtitle>
            </v-list-item>
        </v-list>
    </v-card>
</template>

<script lang="ts" setup>
import type { Room } from '@/types/room/Room';
import { useRouter } from 'vue-router';

const props = defineProps<{
    listName: string,
    rooms: any,
}>()

const router = useRouter();

const isListEmpty = () => {
    return (props.rooms as [])?.length === 0;
}

const handleRoomClick = (room: Room) => {
    router.push({ name: 'room', params: { id: room.id } })
}
</script>
