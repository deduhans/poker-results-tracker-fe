import { faker } from '@faker-js/faker';
import type { CreateUser } from '../../src/types/user/CreateUser';
import type { CreateRoom } from '../../src/types/room/CreateRoom';
import type { CreatePlayer } from '../../src/types/player/CreatePlayer';
import type { CreatePayment } from '../../src/types/payment/CreatePayment';
import { PaymentTypeEnum } from '../../src/types/payment/PaymentTypeEnum';

export function getUser(user?: Partial<CreateUser>): CreateUser {
    let username = 'user_' + faker.internet.username()
        .replace(/[^a-zA-Z0-9_-]/g, '')
        .slice(0, 20);

    const password = 'Pass' + faker.number.int({ min: 10000, max: 99999 });

    const newUser: CreateUser = { username, password };

    if (user) {
        Object.assign(newUser, user);
    }

    return newUser;
}

export function getRoom(userId: number, room?: Partial<CreateRoom>): CreateRoom {
    const newRoom: CreateRoom = {
        name: faker.animal.type(),
        exchange: faker.number.int({ min: 1, max: 1000 }),
        hostId: userId
    };

    if (room) {
        Object.assign(newRoom, room);
    }

    return newRoom;
}

export function getPlayer(userId: number, roomId: number, player?: Partial<CreatePlayer>): CreatePlayer {
    const newPlayer: CreatePlayer = {
        roomId: roomId,
        userId: userId,
        name: faker.internet.username(),
    }

    if (player) {
        Object.assign(newPlayer, player);
    }

    return newPlayer;
}

export function getPayment(roomId: number, playerId: number, payment?: Partial<CreatePayment>): CreatePayment {
    const newPayment: CreatePayment = {
        roomId: roomId,
        playerId: playerId,
        amount: faker.number.int({ min: 50, max: 500 }),
        type: PaymentTypeEnum.Outcome
    };

    if (payment) {
        Object.assign(newPayment, payment);
    }

    return newPayment;
}
