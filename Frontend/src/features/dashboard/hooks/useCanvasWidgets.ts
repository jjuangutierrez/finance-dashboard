import { useState, useEffect, useCallback } from "react";

import { widgetService } from "@/features/widget/services/widget.service";
import type {
  Widget,
  WidgetKind,
  UpdateWidgetLayoutItem,
} from "@/features/widget/types/widget.types";
import { portfolioService } from "@/features/portfolio/services/portfolio.service";
import type { PortfolioSummary } from "@/features/portfolio/types/portfolio.types";

const DEFAULT_WIDGET_NAMES: Record<WidgetKind, string> = {
  summary: "Portfolio Summary",
  tracker: "Expense Tracker",
  saving_goal: "House Savings Goal",
  recurring_expense: "Monthly Subscriptions",
};

// Definimos nuestra propia interfaz nativa sin depender de la librería antigua
export interface CanvasLayoutItem {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export function useCanvasWidgets(portfolioId: string | null) {
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<PortfolioSummary | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);

  useEffect(() => {
    if (!portfolioId) return;
    loadWidgets();
    loadSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [portfolioId]);

  async function loadSummary() {
    if (!portfolioId) return;
    try {
      setLoadingSummary(true);
      const data = await portfolioService.getSummary(portfolioId);
      setSummary(data);
    } catch (error) {
      console.error("Error loading summary:", error);
    } finally {
      setLoadingSummary(false);
    }
  }

  async function loadWidgets() {
    if (!portfolioId) return;
    try {
      setLoading(true);
      const data = await widgetService.getByPortfolio(portfolioId);
      setWidgets(data);
    } catch (error) {
      console.error("Error loading widgets:", error);
    } finally {
      setLoading(false);
    }
  }

  const addWidget = useCallback(
    async (kind: WidgetKind) => {
      if (!portfolioId) return;
      try {
        const newWidget = await widgetService.create(portfolioId, {
          kind,
          name: DEFAULT_WIDGET_NAMES[kind] || "New Widget",
          description: "Click options to customize",
        });
        setWidgets((prev) => [...prev, newWidget]);
      } catch (error) {
        console.error("Error creating widget:", error);
      }
    },
    [portfolioId]
  );

  const deleteWidget = useCallback(
    async (widgetId: string) => {
      if (!portfolioId) return;
      try {
        await widgetService.delete(portfolioId, widgetId);
        setWidgets((prev) => prev.filter((w) => w.id !== widgetId));
      } catch (error) {
        console.error("Error deleting widget:", error);
      }
    },
    [portfolioId]
  );

  const saveLayout = useCallback(
    async (currentLayout: CanvasLayoutItem[]) => {
      if (!portfolioId || widgets.length === 0) return;

      setWidgets((prevWidgets) =>
        prevWidgets.map((w) => {
          const updated = currentLayout.find((item) => item.i === w.id);
          if (!updated) return w;
          return {
            ...w,
            posX: updated.x,
            posY: updated.y,
            width: updated.w,
            height: updated.h,
          };
        })
      );

      const updates: UpdateWidgetLayoutItem[] = currentLayout.map((item) => ({
        id: item.i,
        posX: item.x,
        posY: item.y,
        width: item.w,
        height: item.h,
      }));

      try {
        await widgetService.updateLayout(portfolioId, updates);
      } catch (error) {
        console.error("Error saving layout:", error);
      }
    },
    [portfolioId, widgets.length]
  );

  return {
    widgets,
    loading,
    summary,
    loadingSummary,
    addWidget,
    deleteWidget,
    saveLayout,
  };
}