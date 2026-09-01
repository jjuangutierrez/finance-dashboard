import { useEffect, useCallback } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  MiniMap,
  useNodesState,
  SelectionMode,
  type Node,
  type ResizeParams,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import type { WidgetNodeData } from "../../widget/components/WidgetNode";
import { useTheme } from "next-themes";

import type { Widget, WidgetKind } from "@/features/widget/types/widget.types";
import { WidgetPalette } from "../../widget/components/WidgetPalette";
import { useCanvasWidgets } from "../hooks/useCanvasWidgets";
import { useCanvasRightClickPan } from "../hooks/useCanvasPan";
import { CanvasZoomControls } from "../../canvas/components/CanvasZoomControls";
import { WidgetNode } from "../../widget/components/WidgetNode";
import { getMinGridSize } from "@/features/widget/constants/WidgetSizeConstraints";
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

function resolveMinGridSize(nodeId: string, widgets: Widget[]) {
  const widget = widgets.find((w) => w.id === nodeId);
  return getMinGridSize(widget?.kind, COL_WIDTH, ROW_HEIGHT);
}

function getOtherWidgetRects(widgets: Widget[], excludeId: string): Rect[] {
  return widgets
    .filter((w) => w.id !== excludeId)
    .map((w) => {
      const { minGridW, minGridH } = getMinGridSize(
        w.kind,
        COL_WIDTH,
        ROW_HEIGHT,
      );
      return {
        id: w.id,
        x: w.posX,
        y: w.posY,
        w: Math.max(minGridW, w.width || minGridW),
        h: Math.max(minGridH, w.height || minGridH),
      };
    });
}

function FinancialCanvasInner({ portfolioId }: FinancialCanvasProps) {
  useCanvasRightClickPan();

  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const {
    widgets,
    loading,
    summary,
    loadingSummary,
    addWidget,
    deleteWidget,
    updateWidget,
    saveLayout,
  } = useCanvasWidgets(portfolioId);

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);

  const handleNodeResizeStop = useCallback(
    (nodeId: string, params: ResizeParams) => {
      const { minGridW, minGridH } = resolveMinGridSize(nodeId, widgets);

      const rawX = Math.round(params.x / COL_WIDTH);
      const rawY = Math.round(params.y / ROW_HEIGHT);
      const gridW = Math.max(
        minGridW,
        Math.round((params.width + 16) / COL_WIDTH),
      );
      const gridH = Math.max(
        minGridH,
        Math.round((params.height + 16) / ROW_HEIGHT),
      );

      const otherRects = getOtherWidgetRects(widgets, nodeId);

      const candidateRect: Rect = {
        id: nodeId,
        x: rawX,
        y: rawY,
        w: gridW,
        h: gridH,
      };

      const { x: freeX, y: freeY } = findNearestFreePosition(
        nodeId,
        candidateRect,
        otherRects,
      );

      saveLayout([{ i: nodeId, x: freeX, y: freeY, w: gridW, h: gridH }]);

      setNodes((prevNodes) =>
        prevNodes.map((n) =>
          n.id === nodeId
            ? {
                ...n,
                position: { x: freeX * COL_WIDTH, y: freeY * ROW_HEIGHT },
                style: {
                  ...n.style,
                  width: gridW * COL_WIDTH - 16,
                  height: gridH * ROW_HEIGHT - 16,
                },
              }
            : n,
        ),
      );
    },
    [setNodes, saveLayout, widgets],
  );

  useEffect(() => {
    if (!widgets || widgets.length === 0) {
      setNodes([]);
      return;
    }

    const formattedNodes: Node[] = widgets.map((widget) => {
      const { minGridW, minGridH } = getMinGridSize(
        widget.kind,
        COL_WIDTH,
        ROW_HEIGHT,
      );
      const gridW = Math.max(minGridW, widget.width || minGridW);
      const gridH = Math.max(minGridH, widget.height || minGridH);

      return {
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
          onUpdateWidget: updateWidget,
          onResizeWidget: handleNodeResizeStop,
        },
        style: {
          width: gridW * COL_WIDTH - 16,
          height: gridH * ROW_HEIGHT - 16,
        },
      };
    });

    setNodes(formattedNodes);
  }, [
    widgets,
    portfolioId,
    summary,
    loadingSummary,
    setNodes,
    handleNodeResizeStop,
    deleteWidget,
    updateWidget,
  ]);

  const handleNodeDragStop = useCallback(
    (_: any, node: Node) => {
      const { minGridW, minGridH } = resolveMinGridSize(node.id, widgets);

      const rawX = Math.round(node.position.x / COL_WIDTH);
      const rawY = Math.round(node.position.y / ROW_HEIGHT);

      const draggedWidget = widgets.find((w) => w.id === node.id);
      const gridW = Math.max(minGridW, draggedWidget?.width || minGridW);
      const gridH = Math.max(minGridH, draggedWidget?.height || minGridH);

      const otherRects = getOtherWidgetRects(widgets, node.id);

      const candidateRect: Rect = {
        id: node.id,
        x: rawX,
        y: rawY,
        w: gridW,
        h: gridH,
      };

      const { x: freeX, y: freeY } = findNearestFreePosition(
        node.id,
        candidateRect,
        otherRects,
      );

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
        }),
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
    [nodes, setNodes, saveLayout, widgets],
  );

  const handleSelectionDragStop = useCallback(
    (_: any, selectedNodes: Node[]) => {
      const layoutUpdates = selectedNodes.map((node) => {
        const { minGridW, minGridH } = resolveMinGridSize(node.id, widgets);

        const draggedWidget = widgets.find((w) => w.id === node.id);
        const gridX = Math.round(node.position.x / COL_WIDTH);
        const gridY = Math.round(node.position.y / ROW_HEIGHT);
        const gridW = Math.max(minGridW, draggedWidget?.width || minGridW);
        const gridH = Math.max(minGridH, draggedWidget?.height || minGridH);

        return {
          i: node.id,
          x: gridX,
          y: gridY,
          w: gridW,
          h: gridH,
        };
      });

      saveLayout(layoutUpdates);
    },
    [saveLayout, widgets],
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
          <p className="text-xs">
            Add a widget from the palette below to start.
          </p>
        </div>
      ) : (
        <div className="w-full h-full">
          <ReactFlow
            nodes={nodes}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onNodeDragStop={handleNodeDragStop}
            onSelectionDragStop={handleSelectionDragStop}
            selectionOnDrag={true}
            selectionMode={SelectionMode.Partial}
            panOnDrag={false}
            snapToGrid={true}
            snapGrid={[COL_WIDTH, ROW_HEIGHT]}
            zoomOnScroll={true}
            panOnScroll={false}
            minZoom={0.2}
            maxZoom={2}
            defaultViewport={{ x: 50, y: 50, zoom: 1 }}
            className="bg-background"
          >
            <Background variant={BackgroundVariant.Dots} gap={24} size={1} />

            <MiniMap
              position="top-right"
              pannable
              zoomable
              nodeColor={(node) => {
                const data = node.data as WidgetNodeData | undefined;
                const kind = data?.widget?.kind;

                if (isDark) {
                  switch (kind) {
                    case "summary":
                      return "#1e293b";
                    case "tracker":
                      return "#064e3b";
                    case "savinggoal":
                      return "#1e3a8a"; 
                    case "recurringexpense":
                      return "#581c87";
                    default:
                      return "#27272a";
                  }
                } else {
                  switch (kind) {
                    case "summary":
                      return "#e2e8f0";
                    case "tracker":
                      return "#bbf7d0";
                    case "savinggoal":
                      return "#bfdbfe";
                    case "recurringexpense":
                      return "#e9d5ff";
                    default:
                      return "#f1f5f9";
                  }
                }
              }}
              nodeStrokeColor={isDark ? "#3f3f46" : "#cbd5e1"}
              nodeStrokeWidth={1.5}
              nodeBorderRadius={6}
              bgColor={isDark ? "#09090b" : "#ffffff"}
              maskColor={
                isDark ? "rgba(0, 0, 0, 0.6)" : "rgba(100, 116, 139, 0.15)"
              }
              maskStrokeColor={isDark ? "#10b981" : "#059669"}
              maskStrokeWidth={2}
              className="!bg-card/90 !backdrop-blur-md !border !border-border !rounded-2xl !m-4 !shadow-lg"
              style={{ width: 170, height: 115 }}
            />
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
