import { useState, useEffect } from "react";
import {
  Responsive,
  WidthProvider,
  type LayoutItem,
} from "react-grid-layout/legacy";
import { widgetService } from "@/features/widget/services/widget.service";
import type {
  Widget,
  WidgetKind,
  UpdateWidgetLayoutItem,
} from "@/features/widget/types/widget.types";

import { TrackerWidget } from "../../widget/components/TrackerWidget";
import { WidgetPalette } from "../../widget/components/WidgetPalette";
import { portfolioService } from "@/features/portfolio/services/portfolio.service";
import { PortfolioSummaryBar } from "./PortfolioSummaryBar";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import type { PortfolioSummary } from "@/features/portfolio/types/portfolio.types";

const ResponsiveReactGridLayout = WidthProvider(Responsive) as any;

interface FinancialCanvasProps {
  portfolioId: string | null;
}

export function FinancialCanvas({ portfolioId }: FinancialCanvasProps) {
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<PortfolioSummary | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);

  useEffect(() => {
    if (!portfolioId) return;
    loadWidgets();
    loadSummary();
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

  async function handleAddWidget(kind: WidgetKind) {
    if (!portfolioId) return;

    const defaultNames: Record<WidgetKind, string> = {
      tracker: "Expense Tracker",
      saving_goal: "House Savings Goal",
      recurring_expense: "Monthly Subscriptions",
    };

    try {
      const newWidget = await widgetService.create(portfolioId, {
        kind,
        name: defaultNames[kind] || "New Widget",
        description: "Click options to customize",
      });

      setWidgets((prev) => [...prev, newWidget]);
    } catch (error) {
      console.error("Error creating widget:", error);
    }
  }

  async function handleDeleteWidget(widgetId: string) {
    if (!portfolioId) return;
    try {
      await widgetService.delete(portfolioId, widgetId);
      setWidgets((prev) => prev.filter((w) => w.id !== widgetId));
    } catch (error) {
      console.error("Error deleting widget:", error);
    }
  }

  async function handleLayoutChange(currentLayout: LayoutItem[]) {
    if (!portfolioId || widgets.length === 0) return;

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
  }

  const layoutItems = widgets.map((w) => ({
    i: w.id,
    x: w.posX,
    y: w.posY,
    w: w.width > 12 ? 4 : w.width || 4,
    h: w.height > 20 ? 4 : w.height || 4,
    minW: 3,
    minH: 3,
  }));

  function renderWidgetContent(widget: Widget) {
    if (!portfolioId) return null;

    switch (widget.kind) {
      case "tracker":
        return (
          <TrackerWidget
            portfolioId={portfolioId}
            widgetId={widget.id}
            name={widget.name}
            description={widget.description}
            onDeleteWidget={() => handleDeleteWidget(widget.id)}
          />
        );

      default:
        return (
          <div className="p-4 bg-card border rounded-lg h-full flex items-center justify-center">
            <span className="text-xs text-muted-foreground">
              Widget coming soon
            </span>
          </div>
        );
    }
  }

  return (
    <div className="w-full min-h-screen bg-background relative p-8">
      <PortfolioSummaryBar summary={summary} loading={loadingSummary} />
      {loading ? (
        <div className="flex items-center justify-center h-64 text-sm text-muted-foreground">
          Loading Canvas...
        </div>
      ) : widgets.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-xl p-8 text-center text-muted-foreground">
          <p className="text-sm font-medium">This portfolio canvas is empty.</p>
          <p className="text-xs">
            Add a widget from the palette below to start.
          </p>
        </div>
      ) : (
        <ResponsiveReactGridLayout
          className="layout"
          layouts={{
            lg: layoutItems,
            md: layoutItems,
            sm: layoutItems,
          }}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
          rowHeight={100}
          isDraggable={true}
          isResizable={true}
          draggableHandle=".drag-handle"
          margin={[16, 16]}
          onDragStop={handleLayoutChange}
          onResizeStop={handleLayoutChange}
        >
          {widgets.map((widget) => (
            <div key={widget.id} className="h-full">
              {renderWidgetContent(widget)}
            </div>
          ))}
        </ResponsiveReactGridLayout>
      )}

      <WidgetPalette onAddWidget={handleAddWidget} />
    </div>
  );
}
