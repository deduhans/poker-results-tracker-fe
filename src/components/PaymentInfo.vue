<template>
    <v-list-item class="pa-2">
        <template v-slot:prepend>
            <v-icon :icon="payment.type === PaymentTypeEnum.Outcome ? 'mdi-cash-minus' : 'mdi-cash-plus'"
                   :color="payment.type === PaymentTypeEnum.Outcome ? 'error' : 'success'">
            </v-icon>
        </template>
        <v-list-item-title class="text-subtitle-2">{{ payment.playerName }}</v-list-item-title>
        <template v-slot:append>
            <div class="d-flex align-center">
                <span class="text-subtitle-2 font-weight-medium mr-4"
                      :class="payment.type === PaymentTypeEnum.Outcome ? 'text-error' : 'text-success'">
                    {{ payment.type === PaymentTypeEnum.Outcome ? '-' : '+' }}{{ payment.amount }}€
                </span>
                <span class="text-caption text-medium-emphasis">{{ payment.date }}</span>
            </div>
        </template>
    </v-list-item>
</template>

<script lang="ts" setup>
import { PaymentTypeEnum } from '@/types/payment/PaymentTypeEnum';

interface Payment {
    playerName: string;
    amount: number;
    date: string;
    type: PaymentTypeEnum;
}

defineProps<{
    payment: Payment;
}>();
</script>
