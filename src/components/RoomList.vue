<template>
    <v-card class="my-3">
        <v-card-title>{{ listName }}</v-card-title>
        <v-list>
            <v-list-item v-for="room in rooms" :key="room.id" @click="handleRoomClick(room)" class="room-item">
                <v-list-item-content>
                    <v-list-item-title>{{ room.name }}</v-list-item-title>
                    <v-list-item-subtitle>{{ room.id }} Participants</v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>
        </v-list>
    </v-card>
</template>

<script lang="ts" setup>
import type { Room } from '@/types/room/Room';
import { useRouter } from 'vue-router';

defineProps<{
    listName: string,
    rooms: any,
}>()

const router = useRouter();

const handleRoomClick = (room: Room) => {
    router.push({ name: 'room', params: { id: room.id } })
}
</script>
