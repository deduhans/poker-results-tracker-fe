import type { CreateExchange } from '@/types/payment/CreateExchange';
import axiosClient from '../apiClient';
import type { Exchange } from '@/types/payment/Exchange';

class ExchangeController {
  private readonly CONTROLLER = '/exchanges';

  async createExchange(createExchange: CreateExchange): Promise<Exchange> {
    const url: string = `${this.CONTROLLER}`;

    const response = await axiosClient.post(url, createExchange);

    return response.data as Exchange;
  }
}

export default ExchangeController;