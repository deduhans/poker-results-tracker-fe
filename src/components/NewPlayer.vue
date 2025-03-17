<template>
    <v-dialog v-model="dialog" width="500">
        <template v-slot:activator="{ props }">
            <v-btn v-bind="props" icon="mdi-account-plus"></v-btn>
        </template>

        <v-card>
            <v-card-title class="text-h6">Add Player</v-card-title>

            <v-card-text>
                <v-text-field v-model="name" label="Name"></v-text-field>
            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="createPlayer">Add</v-btn>
                <v-btn color="error" @click="dialog = false">Cancel</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script lang="ts" setup>
import PlayerController from '@/network/lib/player';
import RoomController from '@/network/lib/room';
import { useRoomStore } from '@/stores/room';
import type { CreatePlayer } from '@/types/player/CreatePlayer';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';

const playerController = new PlayerController();
const roomController = new RoomController();
const roomStore = useRoomStore();
const userStore = useUserStore();
const router = useRouter();

const props = defineProps<{
    roomId: number
}>();

const dialog = ref(false);
const name = ref('');

const createPlayer = async () => {
    if (!userStore.userId) {
        return;
    }

    const newPlayer: CreatePlayer = {
        roomId: props.roomId,
        userId: userStore.userId,
        name: name.value
    }

    await playerController.createPlayer(newPlayer);
    const updatedRoom = await roomController.getRoom(props.roomId);
    roomStore.setRoom(updatedRoom);
    dialog.value = false;
    name.value = '';
};
</script>
