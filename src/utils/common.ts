import type { Room } from "@/types/room/Room";

export const formatDate = (date: Date) => {
    return `${date.getHours()}:${date.getMinutes()} ${date.getMonth()}/${date.getDate()}`;
}

export const getPayments = (room: Room): PaymentDetails[] => {
    const mappedPayments: PaymentDetails[] = room.players.flatMap(player => {
        return player.payments?.map(payment => ({
            id: payment.id,
            amount: payment.amount,
            date: formatDate(new Date(payment.createdAt)),
            playerName: player.name,
        }));
    }).filter(payment => payment !== undefined);
    mappedPayments.sort((a, b) => a.id - b.id);
    return mappedPayments;
};

export const getCapacity = (room: Room): number => {
    return getPayments(room).reduce((sum, payment) => sum += payment.amount, 0);
}

export const getChipsCapacity = (room: Room): number => {
    return getCapacity(room) * room.exchange;
}