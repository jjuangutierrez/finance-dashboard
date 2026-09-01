import {
  NodeResizer,
  useStore,
  type NodeProps,
  type Node,
  type ResizeParams,
} from "@xyflow/react";
import type { Widget } from "@/features/widget/types/widget.types";
import type { PortfolioSummary } from "@/features/portfolios/types/portfolio.types";
import { WidgetRenderer } from "./WidgetRenderer";
import { getWidgetSizeConstraint } from "@/features/widget/constants/WidgetSizeConstraints";

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

  // These are always raw pixel values — the single source of truth lives in
  // widgetSizeConstraints.ts. The grid-cell equivalent used for persistence
  // is derived from THESE SAME numbers via getMinGridSize (Math.ceil), so
  // NodeResizer's live limit and the canvas's saved grid size can never
  // disagree at the minimum boundary.
  const { minWidth, minHeight } = getWidgetSizeConstraint(data.widget.kind);

  return (
    <>
      <NodeResizer
        minWidth={minWidth}
        minHeight={minHeight}
        isVisible={canResize}
        handleClassName="!bg-primary !border-2 !border-background !w-3 !h-3 !rounded-sm"
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