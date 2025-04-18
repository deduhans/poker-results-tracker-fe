import type { ExchangeDirectionEnum } from './ExchangeDirectionEnum';

export interface ExchangeDetails {
    id: number;
    amount: string;
    date: string;
    playerName: string;
    type: ExchangeDirectionEnum;
}