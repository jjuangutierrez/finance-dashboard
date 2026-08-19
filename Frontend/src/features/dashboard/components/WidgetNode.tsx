import {
  NodeResizer,
  useStore,
  type NodeProps,
  type Node,
  type ResizeParams,
} from "@xyflow/react";
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
  onUpdateWidget?: (
    widgetId: string,
    data: { name?: string; description?: string },
  ) => void;
  onResizeWidget?: (nodeId: string, params: ResizeParams) => void;
};

export type CustomWidgetNode = Node<WidgetNodeData, "widgetNode">;

export function WidgetNode({
  id,
  data,
  selected,
}: NodeProps<CustomWidgetNode>) {
  const selectedCount = useStore(
    (state) =>
      Array.from(state.nodeLookup.values()).filter((n) => n.selected).length,
  );

  const canResize = selected && selectedCount === 1;

  return (
    <>
      <NodeResizer
        minWidth={240}
        minHeight={140}
        isVisible={canResize}
        handleClassName="!bg-primary !border-2 !border-background !w-2.5 !h-2.5 !rounded-sm"
        lineClassName="!border-primary/60"
        onResizeEnd={(_, params) => {
          data.onResizeWidget?.(id, params);
        }}
      />
      <div className="w-full h-full">
        <WidgetRenderer
          widget={data.widget}
          portfolioId={data.portfolioId}
          widgets={data.widgets}
          summary={data.summary}
          loadingSummary={data.loadingSummary}
          onDeleteWidget={data.onDeleteWidget}
          onUpdateWidget={data.onUpdateWidget}
        />
      </div>
    </>
  );
}