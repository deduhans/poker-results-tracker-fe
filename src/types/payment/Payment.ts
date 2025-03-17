import { PaymentTypeEnum } from "./PaymentTypeEnum";

export interface Payment {
    id: number;
    roomId: number;
    playerId: number;
    amount: number;
    type: PaymentTypeEnum;
    createdAt: Date;
}