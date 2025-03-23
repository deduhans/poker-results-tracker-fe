<template>
    <v-container>
        <v-row justify="space-between" align="center" class="mb-4">
            <v-card-title class="text-h4">{{ name }}</v-card-title>
            <NewPlayer v-if="isOpened()" :roomId="Number(id)" />
        </v-row>

        <v-row>
            <v-col cols="12" md="4">
                <v-card>
                    <v-card-item>
                        <v-card-title class="text-h6 mb-2">Room Details</v-card-title>
                        <v-row>
                            <v-col cols="6">
                                <div class="d-flex flex-column">
                                    <v-card-subtitle class="py-1">Exchange: {{ exchange }}€</v-card-subtitle>
                                    <v-card-subtitle class="py-1">Total Money: {{ capacity }}€</v-card-subtitle>
                                    <v-card-subtitle class="py-1">Total Chips: {{ chipsCapacity }}</v-card-subtitle>
                                </div>
                            </v-col>
                            <v-col cols="6">
                                <div class="d-flex flex-column">
                                    <v-card-subtitle class="py-1">Status: {{ status }}</v-card-subtitle>
                                    <v-card-subtitle class="py-1">Created: {{ created }}</v-card-subtitle>
                                    <v-card-subtitle class="py-1">Players: {{ players?.length || 0 }}</v-card-subtitle>
                                </div>
                            </v-col>
                        </v-row>
                    </v-card-item>
                </v-card>
            </v-col>

            <v-col cols="12" md="8">
                <v-card>
                    <v-card-item>
                        <v-card-title class="text-h6 mb-2">Players</v-card-title>
                        <v-row v-if="players && players.length > 0">
                            <v-col v-for="player in players" :key="player.id" cols="12" sm="6" lg="4">
                                <Player :roomId="Number(id)" :player="player" :status="status" />
                            </v-col>
                        </v-row>
                        <v-card-text v-else class="text-center pa-4">
                            <v-icon icon="mdi-account-multiple-plus" size="x-large" color="grey-lighten-1" class="mb-2"></v-icon>
                            <div class="text-body-1 text-grey">No players have joined yet</div>
                            <div v-if="isOpened()" class="text-caption text-grey-darken-1">Click the "Add Player" button to add players to the room</div>
                            <div v-else class="text-caption text-grey-darken-1">This room is closed and cannot accept new players</div>
                        </v-card-text>
                    </v-card-item>
                </v-card>
            </v-col>
        </v-row>

        <v-row class="mt-4">
            <v-col cols="12">
                <v-card>
                    <v-card-item>
                        <v-card-title class="text-h6 mb-2">Payment History</v-card-title>
                        <v-list v-if="payments && payments.length > 0">
                            <PaymentInfo v-for="payment in payments" :key="payment.id" :payment="payment" />
                        </v-list>
                        <v-card-text v-else class="text-center pa-4">
                            <v-icon icon="mdi-cash-clock" size="x-large" color="grey-lighten-1" class="mb-2"></v-icon>
                            <div class="text-body-1 text-grey">No payments have been made yet</div>
                            <div class="text-caption text-grey-darken-1">Click the + button on a player card to add a payment</div>
                        </v-card-text>
                    </v-card-item>
                </v-card>
            </v-col>
        </v-row>

        <v-row class="mt-4" v-if="isOpened()">
            <v-col cols="12">
                <CloseRoomPopup />
            </v-col>
        </v-row>
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
import type { PaymentDetails } from '@/types/payment/PaymentDetails';
import { PaymentTypeEnum } from '@/types/payment/PaymentTypeEnum';
import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const roomController = new RoomController();
const router = useRouter();
const roomStore = useRoomStore();

const name = ref();
const players = ref();
const payments = ref();
const status = ref();
const roomId = ref<number | null>(null);
const exchange = ref();
const created = ref();
const capacity = ref();
const chipsCapacity = ref();

const props = defineProps<{
    id: string
}>();

const updateRoom = async () => {
  const room: Room = await roomController.getRoom(Number(props.id));
  roomStore.setRoom(room);

  name.value = room.name;
  players.value = room.players;
  payments.value = getPayments(room);
  status.value = room.status;
  roomId.value = room.id;
  exchange.value = room.exchange;
  created.value = formatDate(new Date(room.createdAt));
  capacity.value = getCapacity(room);
  chipsCapacity.value = getChipsCapacity(room);
};

onMounted(updateRoom);

// Watch for room store changes
watch(() => roomStore.room, (newRoom) => {
  if (newRoom) {
    name.value = newRoom.name;
    players.value = newRoom.players;
    payments.value = getPayments(newRoom);
    status.value = newRoom.status;
    roomId.value = newRoom.id;
    exchange.value = newRoom.exchange;
    created.value = formatDate(new Date(newRoom.createdAt));
    capacity.value = getCapacity(newRoom);
    chipsCapacity.value = getChipsCapacity(newRoom);
  }
});

const getPayments = (room: Room): PaymentDetails[] => {
  const mappedPayments: PaymentDetails[] = room.players.flatMap((player) => {
    return player.payments?.map((payment) => ({
      id: payment.id,
      amount: payment.amount,
      date: formatDate(new Date(payment.createdAt)),
      playerName: player.name,
      type: payment.type as PaymentTypeEnum,
    }));
  }).filter((payment) => payment !== undefined);
  mappedPayments.sort((a, b) => a.id - b.id);
  return mappedPayments;
};

const getCapacity = (room: Room): number => {
  return getPayments(room).reduce((sum, payment) => sum += payment.amount, 0);
};

const getChipsCapacity = (room: Room): number => {
  return getCapacity(room) * room.exchange;
};

const formatDate = (date: Date) => {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${hours}:${minutes} ${month}/${day}`;
};

const isOpened = () => {
  return status.value === 'opened';
};
</script>
