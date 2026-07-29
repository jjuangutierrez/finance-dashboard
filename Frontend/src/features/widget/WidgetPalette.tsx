import { Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface WidgetOption {
  kind: "tracker" | "saving_goal" | "recurring_expense";
  title: string;
  emoji: string;
  description: string;
}

const WIDGET_OPTIONS: WidgetOption[] = [
  {
    kind: "tracker",
    title: "Tracker",
    emoji: "📊",
    description: "Ingresos y Gastos",
  },
  {
    kind: "saving_goal",
    title: "Saving Goal",
    emoji: "🎯",
    description: "Meta de Ahorro",
  },
  {
    kind: "recurring_expense",
    title: "Recurring Expense",
    emoji: "🔄",
    description: "Suscripciones y Pagos",
  },
];

interface WidgetPaletteProps {
  onAddWidget?: (kind: string) => void;
}

export function WidgetPalette({ onAddWidget }: WidgetPaletteProps) {
  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
      <Card className="border shadow-lg bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 p-3 rounded-2xl">
        <div className="text-xs font-semibold text-muted-foreground mb-2 px-1 flex items-center justify-between">
          <span>Add Widget</span>
          <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded-full">3 available</span>
        </div>

        <div className="flex gap-2">
          {WIDGET_OPTIONS.map((option) => (
            <button
              key={option.kind}
              onClick={() => onAddWidget?.(option.kind)}
              className="
                group relative flex flex-col items-center p-3 rounded-xl border border-transparent 
                bg-muted/40 hover:bg-accent hover:border-border transition-all duration-200 
                w-28 text-center cursor-pointer hover:scale-105 active:scale-95
              "
            >
              <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">
                {option.emoji}
              </span>

              <span className="text-xs font-medium text-foreground truncate w-full">
                {option.title}
              </span>

              <span className="text-[10px] text-muted-foreground truncate w-full mt-0.5">
                {option.description}
              </span>

              <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-primary text-primary-foreground rounded-full p-0.5">
                <Plus className="h-3 w-3" />
              </div>
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}