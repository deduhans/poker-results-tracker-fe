<template>
    <v-container>
        <v-row justify="space-between">
            <v-card-title>Rooms</v-card-title>
            <NewRoom />
        </v-row>
        <v-col>
            <RoomList :rooms="openRooms" listName="Opened" />
            <RoomList :rooms="closedRooms" listName="Closed" />
        </v-col>
    </v-container>
</template>

<script lang="ts" setup>
import RoomList from '@/components/RoomList.vue';
import RoomController from '@/network/lib/room';
import { onMounted, ref } from 'vue';
import NewRoom from '@/components/NewRoom.vue';
import type { Room } from '@/types/room/Room';

const roomController: RoomController = new RoomController();

const openRooms = ref<Room[]>();
const closedRooms = ref<Room[]>();

onMounted(async () => {
    const response: Room[] = await roomController.getRooms();

    openRooms.value = response.filter(x => x.status === 'opened');
    closedRooms.value = response.filter(x => x.status === 'closed');
})
</script>
