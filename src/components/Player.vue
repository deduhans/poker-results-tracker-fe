<template>
    <v-card class="mx-auto my-2">
        <template v-slot:prepend>
            <v-col class="pa-0">
                <v-card-title>{{ player.name }}</v-card-title>
                <v-card-subtitle>Id: {{ player.id }}</v-card-subtitle>
                <v-card-subtitle>Role: {{ player.role }}</v-card-subtitle>
                <v-card-subtitle>Spend: {{ totalSpend() }}</v-card-subtitle>
            </v-col>
        </template>
        <template v-slot:append>
            <v-btn v-if="isOpened()" @click="createPayment">Buy</v-btn>
        </template>
    </v-card>
</template>

<script lang="ts" setup>
import PaymentController from '@/network/lib/payment';
import { useUserStore } from '@/stores/user';
import type { CreatePayment } from '@/types/payment/CreatePayment';
import { PaymentTypeEnum } from '@/types/payment/PaymentTypeEnum';
import type { Player } from '@/types/player/Player';
import { defineProps } from 'vue';
import { useRouter } from 'vue-router';

const paymentController = new PaymentController();

const userStore = useUserStore();
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

    router.go(0);
};

const isOpened = () => {
    return props.status === "opened";
}

const totalSpend = () => {
    return props.player.payments?.reduce((sum, payment) => sum += payment.amount, 0);
};

const totalEarn = () => {

};

const totalChips = () => {

};
</script>
