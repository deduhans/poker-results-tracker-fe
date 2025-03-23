import type { PaymentTypeEnum } from './PaymentTypeEnum';

export interface CreatePayment {
    roomId: number;
    playerId: number;
    amount: number;
    type: PaymentTypeEnum;
}
