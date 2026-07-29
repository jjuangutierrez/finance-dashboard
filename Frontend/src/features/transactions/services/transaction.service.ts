import api from "@/lib/api";
import type {
  Transaction,
  CreateTransactionRequest,
} from "../types/transaction.types";

export const transactionService = {
  async getByWidget(portfolioId: string, widgetId: string): Promise<Transaction[]> {
    const response = await api.get<Transaction[]>(
      `/portfolios/${portfolioId}/widgets/${widgetId}/transactions`
    );
    return response.data;
  },

  async create(
    portfolioId: string,
    widgetId: string,
    data: CreateTransactionRequest
  ): Promise<Transaction> {
    const response = await api.post<Transaction>(
      `/portfolios/${portfolioId}/widgets/${widgetId}/transactions`,
      data
    );
    return response.data;
  },

  async delete(
    portfolioId: string,
    widgetId: string,
    transactionId: string
  ): Promise<void> {
    await api.delete(
      `/portfolios/${portfolioId}/widgets/${widgetId}/transactions/${transactionId}`
    );
  },
};