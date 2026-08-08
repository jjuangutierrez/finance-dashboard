import type { NodeProps, Node } from "@xyflow/react";
import type { Widget } from "@/features/widget/types/widget.types";
import type { PortfolioSummary } from "@/features/portfolio/types/portfolio.types";
import { WidgetRenderer } from "./WidgetRenderer";

export type WidgetNodeData = {
  widget: Widget;
  portfolioId: string;
  widgets: Widget[];
  summary: PortfolioSummary | null;
  loadingSummary: boolean;
  onDeleteWidget: (widgetId: string) => void;
};

export type CustomWidgetNode = Node<WidgetNodeData, "widgetNode">;

export function WidgetNode({ data }: NodeProps<CustomWidgetNode>) {
  return (
    <div className="w-full h-full">
      <WidgetRenderer
        widget={data.widget}
        portfolioId={data.portfolioId}
        widgets={data.widgets}
        summary={data.summary}
        loadingSummary={data.loadingSummary}
        onDeleteWidget={data.onDeleteWidget}
      />
    </div>
  );
}