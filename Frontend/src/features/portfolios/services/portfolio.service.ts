import api from "@/lib/api";
import type { 
  Portfolio, 
  CreatePortfolioRequest, 
  UpdatePortfolioRequest, 
  PortfolioSummary 
} from "../types/portfolio.types";

export const portfolioService = {
  async getAll(): Promise<Portfolio[]> {
    const response = await api.get<Portfolio[]>("/portfolios");
    return response.data;
  },

  async create(data: CreatePortfolioRequest): Promise<Portfolio> {
    const response = await api.post<Portfolio>("/portfolios", data);
    return response.data;
  },

  async update(id: string, data: UpdatePortfolioRequest): Promise<void> {
    await api.put(`/portfolios/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/portfolios/${id}`);
  },

  async getSummary(id: string): Promise<PortfolioSummary> {
    const response = await api.get<PortfolioSummary>(`/portfolios/${id}/summary`);
    return response.data;
  },
};