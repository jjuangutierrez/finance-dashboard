import { useEffect, useCallback } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  useNodesState,
  type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import type { WidgetKind } from "@/features/widget/types/widget.types";
import { WidgetPalette } from "../../widget/components/WidgetPalette";
import { useCanvasWidgets } from "../hooks/useCanvasWidgets";
import { useCanvasRightClickPan } from "../hooks/useCanvasPan";
import { CanvasZoomControls } from "./CanvasZoomControls";
import { WidgetNode } from "./WidgetNode";
import {
  COL_WIDTH,
  ROW_HEIGHT,
  findNearestFreePosition,
  type Rect,
} from "../utils/canvasCollision";

const nodeTypes = {
  widgetNode: WidgetNode,
};

interface FinancialCanvasProps {
  portfolioId: string | null;
}

function FinancialCanvasInner({ portfolioId }: FinancialCanvasProps) {
  useCanvasRightClickPan();

  const {
    widgets,
    loading,
    summary,
    loadingSummary,
    addWidget,
    deleteWidget,
    saveLayout,
  } = useCanvasWidgets(portfolioId);

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);

  useEffect(() => {
    if (!widgets || widgets.length === 0) {
      setNodes([]);
      return;
    }

    const formattedNodes: Node[] = widgets.map((widget) => ({
      id: widget.id,
      type: "widgetNode",
      position: {
        x: widget.posX * COL_WIDTH,
        y: widget.posY * ROW_HEIGHT,
      },
      dragHandle: ".drag-handle",
      data: {
        widget,
        portfolioId: portfolioId || "",
        widgets,
        summary,
        loadingSummary,
        onDeleteWidget: deleteWidget,
      },
      style: {
        width: (widget.width || 4) * COL_WIDTH - 16,
        height: (widget.height || 4) * ROW_HEIGHT - 16,
      },
    }));

    setNodes(formattedNodes);
  }, [widgets, portfolioId, setNodes]);

  const handleNodeDragStop = useCallback(
    (_: any, node: Node) => {
      const rawX = Math.round(node.position.x / COL_WIDTH);
      const rawY = Math.round(node.position.y / ROW_HEIGHT);
      const gridW = Math.max(3, Math.round(((node.measured?.width || 400) + 16) / COL_WIDTH));
      const gridH = Math.max(2, Math.round(((node.measured?.height || 300) + 16) / ROW_HEIGHT));

      const otherRects: Rect[] = nodes.map((n) => {
        const w = Math.max(3, Math.round(((n.measured?.width || 400) + 16) / COL_WIDTH));
        const h = Math.max(2, Math.round(((n.measured?.height || 300) + 16) / ROW_HEIGHT));
        return {
          id: n.id,
          x: Math.round(n.position.x / COL_WIDTH),
          y: Math.round(n.position.y / ROW_HEIGHT),
          w,
          h,
        };
      });

      const candidateRect: Rect = {
        id: node.id,
        x: rawX,
        y: rawY,
        w: gridW,
        h: gridH,
      };

      const { x: freeX, y: freeY } = findNearestFreePosition(node.id, candidateRect, otherRects);

      setNodes((prevNodes) =>
        prevNodes.map((n) => {
          if (n.id === node.id) {
            return {
              ...n,
              position: {
                x: freeX * COL_WIDTH,
                y: freeY * ROW_HEIGHT,
              },
            };
          }
          return n;
        })
      );

      saveLayout([
        {
          i: node.id,
          x: freeX,
          y: freeY,
          w: gridW,
          h: gridH,
        },
      ]);
    },
    [nodes, setNodes, saveLayout]
  );

  function handleAddWidget(kind: WidgetKind) {
    addWidget(kind);
  }

  return (
    <div className="w-full h-full overflow-hidden bg-background relative select-none">
      <CanvasZoomControls />

      {loading ? (
        <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
          Loading Canvas...
        </div>
      ) : widgets.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-xl p-8 text-center text-muted-foreground bg-card/50 backdrop-blur max-w-md mx-auto mt-20">
          <p className="text-sm font-medium">This portfolio canvas is empty.</p>
          <p className="text-xs">Add a widget from the palette below to start.</p>
        </div>
      ) : (
        <div className="w-full h-full">
          <ReactFlow
            nodes={nodes}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onNodeDragStop={handleNodeDragStop}
            snapToGrid={true}
            snapGrid={[16, 16]}
            zoomOnScroll={true}
            panOnScroll={false}
            panOnDrag={false}
            minZoom={0.2}
            maxZoom={2}
            defaultViewport={{ x: 50, y: 50, zoom: 1 }}
            className="bg-background"
          >
            <Background variant={BackgroundVariant.Dots} gap={24} size={1} />
          </ReactFlow>
        </div>
      )}

      <WidgetPalette onAddWidget={handleAddWidget} />
    </div>
  );
}

export function FinancialCanvas(props: FinancialCanvasProps) {
  return (
    <ReactFlowProvider>
      <FinancialCanvasInner {...props} />
    </ReactFlowProvider>
  );
}