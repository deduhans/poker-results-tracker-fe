<template>
    <v-dialog v-model="dialog" width="500" data-cy="new-player-dialog">
        <template v-slot:activator="{ props }">
            <v-btn v-bind="props" icon="mdi-account-plus" data-cy="new-player-button"></v-btn>
        </template>

        <v-card>
            <v-card-title class="text-h6" data-cy="new-player-title">Add Player</v-card-title>

            <v-card-text>
                <v-text-field v-model="name" label="Name" data-cy="new-player-name"></v-text-field>
            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="createPlayer" data-cy="new-player-add">Add</v-btn>
                <v-btn color="error" @click="dialog = false" data-cy="new-player-cancel">Cancel</v-btn>
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
        name: name.value,
    };

    await playerController.createPlayer(newPlayer);
    const updatedRoom = await roomController.getRoom(props.roomId);
    roomStore.setRoom(updatedRoom);
    dialog.value = false;
    name.value = '';
};
</script>
