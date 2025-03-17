import type { PaymentTypeEnum } from "./PaymentTypeEnum";

export interface PaymentDetails {
    id: number;
    amount: number;
    date: string;
    playerName: string;
    type: PaymentTypeEnum;
}