<template>
    <v-container>
        <v-row justify="space-between">
            <v-card-title>{{ name }}</v-card-title>
            <NewPlayer v-if="isOpened()" :roomId="Number(id)" />
        </v-row>
        <v-col>
            <v-card>
                <v-card-subtitle>Id: {{ id }}</v-card-subtitle>
                <v-card-subtitle>Exchange: {{ exchange }}</v-card-subtitle>
                <v-card-subtitle>Created: {{ created }}</v-card-subtitle>
                <v-card-subtitle>Status: {{ status }}</v-card-subtitle>
                <v-card-subtitle>Capacity: {{ capacity }}</v-card-subtitle>
                <v-card-subtitle>Chips capacity: {{ chipsCapacity }}</v-card-subtitle>
            </v-card>
        </v-col>
        <v-col>
            <Player v-for="player in players" :roomId="Number(id)" :player="player" :status="status" />
        </v-col>
        <v-col>
            <PaymentInfo v-for="payment in payments" :playerName="payment?.playerName" :amount="payment?.amount"
                :date="payment?.date" />
        </v-col>
        <v-col>
            <CloseRoomPopup></CloseRoomPopup>
        </v-col>
    </v-container>
</template>

<script setup lang="ts">
import CloseRoomPopup from '@/components/CloseRoomPopup.vue';
import NewPlayer from '@/components/NewPlayer.vue';
import PaymentInfo from '@/components/PaymentInfo.vue';
import Player from '@/components/Player.vue';
import RoomController from '@/network/lib/room';
import { useRoomStore } from '@/stores/room';
import type { Room } from '@/types/room/Room';
import { onMounted, type PropType, ref } from 'vue';
import { useRouter } from 'vue-router';

const roomController = new RoomController();

const router = useRouter();
const roomStore = useRoomStore();

const name = ref();
const players = ref();
const payments = ref();
const status = ref();
const id = ref<number | null>(null);
const exchange = ref();
const created = ref();
const capacity = ref();
const chipsCapacity = ref();

const props = defineProps<{
    id: string
}>();

onMounted(async () => {
    const room: Room = await roomController.getRoom(Number(props.id));

    roomStore.setRoom(room);

    name.value = room.name;
    players.value = room.players;
    payments.value = getPayments(room);
    status.value = room.status;
    id.value = room.id;
    exchange.value = room.exchange;
    created.value = room.createdAt;
    capacity.value = getCapacity(room);
    chipsCapacity.value = getChipsCapacity(room);
});

const closeRoom = async () => {
    //await roomController.closeRoom(Number(props.id), un);

    router.go(0);
};

const getPayments = (room: Room): PaymentDetails[] => {
    const mappedPayments: PaymentDetails[] = room.players.flatMap(player => {
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

const getCapacity = (room: Room): number => {
    return getPayments(room).reduce((sum, payment) => sum += payment.amount, 0);
}

const getChipsCapacity = (room: Room): number => {
    return getCapacity(room) * room.exchange;
}

const formatDate = (date: Date) => {
    return `${date.getHours()}:${date.getMinutes()} ${date.getMonth()}/${date.getDate()}`;
}

const isOpened = () => {
    return status.value === "opened";
}
</script>
