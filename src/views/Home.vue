<template>
    <v-container>
        <v-row justify="space-between" align="center" class="mb-4">
            <v-card-title class="text-h4">Rooms</v-card-title>
            <NewRoom />
        </v-row>

        <v-alert
            v-if="error"
            type="error"
            variant="outlined"
            density="compact"
            class="mb-4"
        >
            {{ errorMessage }}
        </v-alert>

        <v-progress-linear
            v-if="loading"
            indeterminate
            color="primary"
        ></v-progress-linear>

        <v-col v-else>
            <RoomList 
                :rooms="openRooms || []"
                listName="Open Rooms"
            />
            <RoomList 
                :rooms="closedRooms || []"
                listName="Closed Rooms"
            />
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
const loading = ref(true);
const error = ref(false);
const errorMessage = ref('');

const loadRooms = async () => {
  loading.value = true;
  error.value = false;
  errorMessage.value = '';

  try {
    const response = await roomController.getRooms();
    openRooms.value = response.filter((room) => room.status === 'opened');
    closedRooms.value = response.filter((room) => room.status === 'closed');
  } catch (e: any) {
    error.value = true;
    errorMessage.value = e.response?.data?.message || 'Failed to load rooms';
    console.error('Error loading rooms:', e);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadRooms();
});
</script>
