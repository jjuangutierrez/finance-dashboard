import { useState, useEffect, useCallback } from "react";

import { widgetService } from "@/features/widget/services/widget.service";
import type {
  Widget,
  WidgetKind,
  UpdateWidgetLayoutItem,
} from "@/features/widget/types/widget.types";
import { portfolioService } from "@/features/portfolios/services/portfolio.service";
import type { PortfolioSummary } from "@/features/portfolios/types/portfolio.types";
import { getMinGridSize } from "@/features/widget/constants/WidgetSizeConstraints";
import {
  COL_WIDTH,
  ROW_HEIGHT,
  findNearestFreePosition,
  type Rect,
} from "../utils/canvasCollision";

const DEFAULT_WIDGET_NAMES: Record<WidgetKind, string> = {
  summary: "Portfolio Summary",
  tracker: "Expense Tracker",
  savinggoal: "Savings Goal",
  recurringexpense: "Monthly Subscriptions",
};

/**
 * Default VISUAL size for a newly created widget, in pixels — independent
 * of grid resolution. These numbers are the "looks right" sizes (same as
 * what the app used to render back when COL_WIDTH=250 / ROW_HEIGHT=116),
 * kept as a fixed pixel target so that changing COL_WIDTH/ROW_HEIGHT (grid
 * fineness) never changes how big a new widget LOOKS — only how many cells
 * it takes to represent that same pixel size.
 */
const DEFAULT_WIDGET_PIXEL_SIZES: Record<
  WidgetKind,
  { width: number; height: number }
> = {
  summary: { width: 1750, height: 232 },
  tracker: { width: 500, height: 500 },
  savinggoal: { width: 500, height: 500 },
  recurringexpense: { width: 550, height: 500 },
};

const DEFAULT_PIXEL_SIZE = { width: 750, height: 232 };

/**
 * Converts the fixed pixel target above into grid cells using the CURRENT
 * COL_WIDTH/ROW_HEIGHT (Math.ceil, so we never round down below the target),
 * then clamps to the widget kind's real minimum via getMinGridSize so a
 * widget never spawns smaller than its content needs.
 */
function getDefaultSize(kind: WidgetKind) {
  const pixelSize = DEFAULT_WIDGET_PIXEL_SIZES[kind] || DEFAULT_PIXEL_SIZE;
  const { minGridW, minGridH } = getMinGridSize(kind, COL_WIDTH, ROW_HEIGHT);

  const width = Math.max(minGridW, Math.ceil(pixelSize.width / COL_WIDTH));
  const height = Math.max(minGridH, Math.ceil(pixelSize.height / ROW_HEIGHT));

  return { width, height };
}

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

        const defaultSize = getDefaultSize(kind);
        const width = defaultSize.width;
        const height = defaultSize.height;

        const otherRects: Rect[] = widgets.map((w) => ({
          id: w.id,
          x: w.posX,
          y: w.posY,
          w: w.width || getDefaultSize(w.kind).width,
          h: w.height || getDefaultSize(w.kind).height,
        }));

        const candidateRect: Rect = {
          id: newWidget.id,
          x: newWidget.posX ?? 0,
          y: newWidget.posY ?? 0,
          w: width,
          h: height,
        };

        const { x: freeX, y: freeY } = findNearestFreePosition(
          newWidget.id,
          candidateRect,
          otherRects,
        );

        const placedWidget: Widget = {
          ...newWidget,
          posX: freeX,
          posY: freeY,
          width,
          height,
        };

        setWidgets((prev) => [...prev, placedWidget]);

        await widgetService.updateLayout(portfolioId, [
          {
            id: placedWidget.id,
            posX: freeX,
            posY: freeY,
            width,
            height,
          },
        ]);
      } catch (error) {
        console.error("Error creating widget:", error);
      }
    },
    [portfolioId, widgets],
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
    [portfolioId],
  );

  const updateWidget = useCallback(
    async (widgetId: string, data: { name?: string; description?: string }) => {
      if (!portfolioId) return;

      setWidgets((prev) =>
        prev.map((w) => (w.id === widgetId ? { ...w, ...data } : w)),
      );

      try {
        await widgetService.update(portfolioId, widgetId, data);
      } catch (error) {
        console.error("Error updating widget:", error);
        loadWidgets();
      }
    },
    [portfolioId],
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
        }),
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
    [portfolioId, widgets.length],
  );

  return {
    widgets,
    loading,
    summary,
    loadingSummary,
    addWidget,
    deleteWidget,
    updateWidget,
    saveLayout,
  };
}