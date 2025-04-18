import type { Exchange } from '../payment/Exchange';
import type { PlayerRoleEnum } from './PlayerRole';
import type { User } from '../user/User';

export interface Player {
    id: number;
    roomId: number;
    name: string;
    role: PlayerRoleEnum;
    exchanges: Exchange[];
    createdAt: Date;
    user?: User; // User assigned to this player (optional)
}