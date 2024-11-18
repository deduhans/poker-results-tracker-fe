import type { Player } from "../player/Player";
import type { RoomStatusEnum } from "./RoomStatusEnum";

export interface Room {
    id: number;
    hostId: number;
    name: string;
    exchange: number;
    status: RoomStatusEnum;
    players: Player[];
    createdAt: Date;
}