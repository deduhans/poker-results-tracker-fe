<template>
    <v-btn @click="openDialog">Add player</v-btn>
    <v-dialog v-model="dialog" max-width="500px">
        <v-card>
            <v-card-title>Add player</v-card-title>
            <v-card-text>
                <v-form ref="form" v-model="valid">
                    <v-text-field v-model="name" label="Name" required></v-text-field>
                </v-form>
            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="createPlayer">Create</v-btn>
                <v-btn color="grey" @click="closeDialog">Cancel</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import PlayerController from '@/network/lib/player';
import { useUserStore } from '@/stores/user';
import type { CreatePlayer } from '@/types/player/CreatePlayer';

const playerController = new PlayerController();

const userStore = useUserStore();
const router = useRouter();

const dialog = ref(false);
const name = ref('');
const valid = ref(false);

const props = defineProps<{
    roomId: number
}>();

const openDialog = () => {
    dialog.value = true;
}

const closeDialog = () => {
    dialog.value = false;
}

const createPlayer = async () => {
    if (!userStore.userId) {
        return;
    }

    const newPlayer: CreatePlayer = {
        roomId: props.roomId,
        userId: userStore.userId,
        name: name.value
    };

    await playerController.createPlayer(newPlayer);

    closeDialog();

    router.go(0);
};
</script>
