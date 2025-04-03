import type { ExchangeDirectionEnum } from './ExchangeDirectionEnum';

export interface Exchange {
    id: number;
    roomId: number;
    playerId: number;
    chipAmount: number;
    cashAmount: number;
    direction: ExchangeDirectionEnum;
    createdAt: Date;
}