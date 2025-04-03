import type { Exchange } from '../payment/Exchange';
import type { PlayerRoleEnum } from './PlayerRole';

export interface Player {
    id: number;
    roomId: number;
    name: string;
    role: PlayerRoleEnum;
    exchanges: Exchange[];
    createdAt: Date;
}