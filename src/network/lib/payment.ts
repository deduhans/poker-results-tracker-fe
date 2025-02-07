import type { CreatePayment } from "@/types/payment/CreatePayment";
import axiosClient from "../apiClient";
import type { Payment } from "@/types/payment/Payment";

class PaymentController {
    private readonly CONTROLLER = '/payments';

    async createPayment(createPayment: CreatePayment): Promise<Payment> {
        const url: string = `${this.CONTROLLER}`;

        const response = await axiosClient.post(url, createPayment);

        return response.data as Payment;
    }
}

export default PaymentController;