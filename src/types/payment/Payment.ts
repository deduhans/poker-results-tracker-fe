export interface Payment {
    id: number;
    roomId: number;
    playerId: number;
    amount: number;
    createdAt: Date;
}