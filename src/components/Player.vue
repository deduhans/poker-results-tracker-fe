<template>
    <v-card class="mx-auto my-2" max-width="300">
        <v-card-item>
            <v-row align="center" no-gutters>
                <v-col cols="auto" class="mr-2">
                    <v-icon v-if="player.role === PlayerRoleEnum.Host" color="warning" icon="mdi-crown"></v-icon>
                    <v-icon v-else color="primary" icon="mdi-account"></v-icon>
                </v-col>
                <v-col>
                    <v-card-title class="text-subtitle-1 py-1">{{ player.name }}</v-card-title>
                    <v-card-subtitle class="py-1">Spend: {{ totalSpend() }}€</v-card-subtitle>
                </v-col>
                <v-col cols="auto">
                    <v-btn v-if="isOpened()" @click="createPayment" icon="mdi-plus" size="small"></v-btn>
                </v-col>
            </v-row>
        </v-card-item>
    </v-card>
</template>

<script lang="ts" setup>
import PaymentController from '@/network/lib/payment';
import RoomController from '@/network/lib/room';
import { useUserStore } from '@/stores/user';
import { useRoomStore } from '@/stores/room';
import type { CreatePayment } from '@/types/payment/CreatePayment';
import { PaymentTypeEnum } from '@/types/payment/PaymentTypeEnum';
import type { Player } from '@/types/player/Player';
import { PlayerRoleEnum } from '@/types/player/PlayerRole';
import { defineProps } from 'vue';
import { useRouter } from 'vue-router';

const paymentController = new PaymentController();
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

    const newPayment: CreatePayment = {
        roomId: props.roomId,
        playerId: props.player.id,
        amount: 50,
        type: PaymentTypeEnum.Outcome
    }

    await paymentController.createPayment(newPayment);
    const updatedRoom = await roomController.getRoom(props.roomId);
    roomStore.setRoom(updatedRoom);
};

const isOpened = () => {
    return props.status === "opened";
}

const totalSpend = () => {
    return props.player.payments?.reduce((sum, payment) => sum += payment.amount, 0) || 0;
};
</script>
