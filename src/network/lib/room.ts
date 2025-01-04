import type { Room } from "@/types/room/Room";
import axiosClient from "../apiClient";
import type { CreateRoom } from "@/types/room/CreateRoom";

class RoomController {
    private readonly CONTROLLER: string = '/rooms';

    async getRooms(): Promise<Room[]> {
        const url: string = `${this.CONTROLLER}`;
        const response = await axiosClient.get(url);

        return response.data as Room[];
    }

    async getRoom(id: number): Promise<Room> {
        const url: string = `${this.CONTROLLER}/${id}`;
        const response = await axiosClient.get(url);

        return response.data as Room;
    }

    async createRoom(createRoom: CreateRoom): Promise<Room> {
        const url: string = `${this.CONTROLLER}/create`;
        const response = await axiosClient.post(url, createRoom);

        return response.data as Room;
    }

    async closeRoom(id: number): Promise<void> {
        const url: string = `${this.CONTROLLER}/close/${id}`;

        await axiosClient.put(url);
    }
}

export default RoomController;