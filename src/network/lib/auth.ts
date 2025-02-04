import axiosClient from "../apiClient";
import type { Auth } from "@/types/auth/Auth";

class AuthController {
    private readonly CONTROLLER = '/auth';

    async login(auth: Auth): Promise<any> {
        const url: string = `${this.CONTROLLER}/login`;

        const response = await axiosClient.post(url, auth);

        return response.data;
    }

    async logout(): Promise<void> {
        const url: string = `${this.CONTROLLER}/logout`;

        await axiosClient.get(url);
    }
}

export default AuthController;