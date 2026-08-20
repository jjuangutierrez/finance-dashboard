import { Card } from "@/components/ui/card";
import { WIDGET_OPTIONS } from "../constants/widgetOptions";
import { WidgetPaletteItem } from "./WidgetPaletteItem";
import type { WidgetKind } from "../types/widget.types";

interface WidgetPaletteProps {
  onAddWidget?: (kind: WidgetKind) => void;
}

export function WidgetPalette({ onAddWidget }: WidgetPaletteProps) {
  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
      <Card className="border shadow-lg bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 p-3 rounded-2xl">
        <div className="text-xs font-semibold text-muted-foreground mb-2 px-1 flex items-center justify-between">
          <span>Add Widget</span>
          <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded-full">
            {WIDGET_OPTIONS.length} available
          </span>
        </div>

        <div className="flex gap-2">
          {WIDGET_OPTIONS.map((option) => (
            <WidgetPaletteItem
              key={option.kind}
              option={option}
              onSelect={(kind) => onAddWidget?.(kind)}
            />
          ))}
        </div>
      </Card>
    </div>
  );
}