import api from "@/lib/api";
import type { Widget, CreateWidgetRequest, UpdateWidgetLayoutItem, UpdateWidgetRequest } from "../types/widget.types";

export const widgetService = {
  async getByPortfolio(portfolioId: string): Promise<Widget[]> {
    const response = await api.get<Widget[]>(`/portfolios/${portfolioId}/widgets`);
    return response.data;
  },

  async create(portfolioId: string, data: CreateWidgetRequest): Promise<Widget> {
    const response = await api.post<Widget>(`/portfolios/${portfolioId}/widgets`, data);
    return response.data;
  },

  async updateLayout(portfolioId: string, items: UpdateWidgetLayoutItem[]): Promise<void> {
    await api.patch(`/portfolios/${portfolioId}/widgets/layout`, items);
  },

  async update(
    portfolioId: string,
    widgetId: string,
    data: UpdateWidgetRequest
  ): Promise<void> {
    await api.put(`/portfolios/${portfolioId}/widgets/${widgetId}`, data);
  },

  async delete(portfolioId: string, widgetId: string): Promise<void> {
    await api.delete(`/portfolios/${portfolioId}/widgets/${widgetId}`);
  },
};