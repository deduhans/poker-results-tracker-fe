<template>
    <v-btn v-if="isRoomOpened()" block color="red-lighten-2" @click="openDialog">Close room</v-btn>
    <v-dialog v-model="dialog" max-width="500px">
        <v-card>
            <v-card-title>Closing room</v-card-title>
            <v-card-subtitle>Chips to distribution: {{ totalChipsCapacity() }}</v-card-subtitle>
            <v-card-subtitle>Distributed: {{ totalValue }}</v-card-subtitle>

            <v-list>
                <v-list-item v-for="(player, index) in playersResults" :key="index">
                    <v-list-item-title>{{ player.name }}</v-list-item-title>
                    <v-list-item-subtitle>
                        <v-text-field v-model.number="player.value" type="number"
                            :rules="[v => !!v || 'Please enter a value']"></v-text-field>
                    </v-list-item-subtitle>
                </v-list-item>
            </v-list>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="closeRoom">Confirm</v-btn>
                <v-btn color="grey" @click="closeDialog">Cancel</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script lang="ts" setup>
import RoomController from '@/network/lib/room';
import { useRoomStore } from '@/stores/room';
import type { Player } from '@/types/player/Player';
import type { PlayerResult } from '@/types/player/PlayerResult';
import type { Room } from '@/types/room/Room';
import { getChipsCapacity } from '@/utils/common'
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const roomController = new RoomController();

const router = useRouter();
const roomStore = useRoomStore();

const dialog = ref(false);
const playersResults = ref<any>(null);

let room: Room;

const openDialog = () => {
    const storedRoom: Room | null = roomStore.room;

    if (!storedRoom) {
        return;
    }

    room = storedRoom;

    playersResults.value = room.players.map(player => ({
        id: player.id,
        name: player.name,
        value: 0,
    }));

    dialog.value = true;
}

const closeDialog = () => {
    dialog.value = false;
}

const closeRoom = async () => {
    const results = playersResults.value?.map((player: { id: number, value: number }) => {
        return { id: player.id, income: player.value / room.exchange } as PlayerResult
    });

    if (!results) {
        return;
    }

    await roomController.closeRoom(Number(room.id), results);

    router.go(0);
};

const isRoomOpened = () => {
    return roomStore.roomStatus === "opened";
}

const totalChipsCapacity = () => {
    return getChipsCapacity(room);
}

const totalValue = computed(() => {
    return playersResults.value?.reduce((sum: number, player: { value: number }) => sum + player.value, 0);
});

</script>