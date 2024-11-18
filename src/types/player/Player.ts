import type { Payment } from "../payment/Payment";
import type { PlayerRoleEnum } from "./PlayerRole";

export interface Player {
    id: number;
    roomId: number;
    name: string;
    role: PlayerRoleEnum;
    payments: Payment[];
    createdAt: Date;
}