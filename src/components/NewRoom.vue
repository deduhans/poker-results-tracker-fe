<template>
    <v-btn @click="openDialog">Add new</v-btn>
    <v-dialog v-model="dialog" max-width="500px">
        <v-card>
            <v-card-title>Create Item</v-card-title>
            <v-card-text>
                <v-form ref="form" v-model="valid">
                    <v-text-field v-model="name" label="Name" required></v-text-field>
                    <v-text-field v-model="exchange" label="Exchange" type="number" required></v-text-field>
                </v-form>
            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="createItem">Create</v-btn>
                <v-btn color="grey" @click="closeDialog">Cancel</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script lang="ts" setup>
import RoomController from '@/network/lib/room';
import { useUserStore } from '@/stores/user';
import type { CreateRoom } from '@/types/room/CreateRoom';
import type { Room } from '@/types/room/Room';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const roomController = new RoomController();

const userStore = useUserStore();
const router = useRouter();

const dialog = ref(false);
const name = ref('');
const exchange = ref<number | null>(null);
const valid = ref(false);

const openDialog = () => {
    dialog.value = true;
}

const closeDialog = () => {
    dialog.value = false;
}

const createItem = async () => {
    if (!userStore.userId) {
        return;
    }

    const createRoomDto: CreateRoom = {
        name: name.value,
        exchange: Number(exchange.value) || 10,
        hostId: userStore.userId
    }
    const room: Room = await roomController.createRoom(createRoomDto);

    router.push({ name: 'room', params: { id: room.id } })
};
</script>
