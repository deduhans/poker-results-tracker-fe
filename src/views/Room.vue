<template>
    <v-container>
        <v-row justify="space-between">
            <v-card-title>{{ name }}</v-card-title>
            <NewPlayer v-if="isOpened()" :roomId="Number(id)" />
        </v-row>
        <v-col>
            <Player v-for="player in players" :roomId="Number(id)" :player="player" :status="status" />
        </v-col>
        <v-col>
            <PaymentInfo v-for="payment in payments" :playerName="payment?.playerName" :amount="payment?.amount"
                :date="payment?.date" />
        </v-col>
        <v-col>
            <v-btn v-if="isOpened()" block color="red-lighten-2" @click="closeRoom">Close room</v-btn>
        </v-col>
    </v-container>
</template>

<script lang="ts" setup>
import NewPlayer from '@/components/NewPlayer.vue';
import PaymentInfo from '@/components/PaymentInfo.vue';
import Player from '@/components/Player.vue';
import RoomController from '@/network/lib/room';
import type { Room } from '@/types/room/Room';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const roomController = new RoomController();

const router = useRouter();

const name = ref();
const players = ref();
const payments = ref();
const status = ref();

const props = defineProps<{
    id: string
}>();

onMounted(async () => {
    const room: Room = await roomController.getRoom(Number(props.id));
    name.value = room.name;
    players.value = room.players;
    payments.value = getPayments(room);
    status.value = room.status;
});

const closeRoom = async () => {
    await roomController.closeRoom(Number(props.id));

    router.go(0);
};

const getPayments = (room: Room) => {
    const mappedPayments = room.players.flatMap(player => {
        return player.payments?.map(payment => ({
            id: payment.id,
            amount: payment.amount,
            date: formatDate(new Date(payment.createdAt)),
            playerName: player.name,
        }));
    }).filter(payment => payment !== undefined);
    mappedPayments.sort((a, b) => a.id - b.id);
    return mappedPayments;
};

const formatDate = (date: Date) => {
    return `${date.getHours()}:${date.getMinutes()} ${date.getMonth()}/${date.getDate()}`;
}

const isOpened = () => {
    return status.value === "opened";
}
</script>
