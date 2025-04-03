<template>
  <v-card class="mx-auto my-0" max-width="300">
    <v-card-item>
      <v-row align="center" no-gutters>
        <v-col cols="auto" class="mr-2">
          <v-icon v-if="player.role === PlayerRoleEnum.Host" color="warning" icon="mdi-crown"></v-icon>
          <v-icon v-else color="primary" icon="mdi-account"></v-icon>
        </v-col>
        <v-col>
          <v-card-title class="text-subtitle-1 py-1">{{ player.name }}</v-card-title>
          <v-card-subtitle class="py-1">Spend: {{ totalSpend() }}€</v-card-subtitle>
          <v-card-subtitle class="py-1">Income: {{ totalIncome() }}€</v-card-subtitle>
        </v-col>
        <v-col cols="auto">
          <v-btn v-if="isOpened()" @click="createPayment" icon="mdi-plus" size="small"
            data-cy="create-payment-button"></v-btn>
        </v-col>
      </v-row>
    </v-card-item>
  </v-card>
</template>

<script lang="ts" setup>
import ExchangeController from '@/network/lib/exchange';
import RoomController from '@/network/lib/room';
import { useUserStore } from '@/stores/user';
import { useRoomStore } from '@/stores/room';
import type { CreateExchange } from '@/types/payment/CreateExchange';
import { ExchangeDirectionEnum } from '@/types/payment/ExchangeDirectionEnum';
import type { Player } from '@/types/player/Player';
import { PlayerRoleEnum } from '@/types/player/PlayerRole';
import { useRouter } from 'vue-router';

const exchangeController = new ExchangeController();
const roomController = new RoomController();
const userStore = useUserStore();
const roomStore = useRoomStore();
const router = useRouter();

const props = defineProps<{
  roomId: number,
  player: Player,
  status: any
}>();

const createPayment = async () => {
  if (!userStore.userId) {
    return;
  }

  const newExchange: CreateExchange = {
    roomId: props.roomId,
    playerId: props.player.id,
    amount: 50,
    type: ExchangeDirectionEnum.BuyIn,
  };

  await exchangeController.createExchange(newExchange);
  const updatedRoom = await roomController.getRoom(props.roomId);
  roomStore.setRoom(updatedRoom);
};

const isOpened = () => {
  return props.status === 'opened';
};

const totalSpend = () => {
  return props.player.exchanges?.filter((payment) => payment.direction === ExchangeDirectionEnum.BuyIn).reduce((sum, payment) => sum += payment.cashAmount, 0) || 0;
};

const totalIncome = () => {
  return props.player.exchanges?.filter((payment) => payment.direction === ExchangeDirectionEnum.CashOut).reduce((sum, payment) => sum += payment.cashAmount, 0) || 0;
};

</script>
