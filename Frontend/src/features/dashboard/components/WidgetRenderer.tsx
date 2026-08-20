import type { Widget } from "@/features/widget/types/widget.types";
import type { PortfolioSummary } from "@/features/portfolio/types/portfolio.types";

import { TrackerWidget } from "../../widget/components/TrackerWidget";
import { SummaryWidget } from "../../widget/components/SummaryWidget";
import { SavingGoalWidget } from "@/features/widget/components/SavingGoalWidget";
import { RecurringExpenseWidget } from "@/features/widget/components/RecurringExpenseWidget";

interface WidgetRendererProps {
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
}

export function WidgetRenderer({
  widget,
  portfolioId,
  widgets,
  summary,
  loadingSummary,
  onDeleteWidget,
  onUpdateWidget,
}: WidgetRendererProps) {
  switch (widget.kind) {
    case "summary":
      return (
        <SummaryWidget
          portfolioId={portfolioId}
          widgetId={widget.id}
          name={widget.name}
          description={widget.description}
          summary={summary}
          loading={loadingSummary}
          widgets={widgets}
          onDeleteWidget={() => onDeleteWidget(widget.id)}
          onUpdateWidget={(data) => onUpdateWidget?.(widget.id, data)}
        />
      );

    case "tracker":
      return (
        <TrackerWidget
          portfolioId={portfolioId}
          widgetId={widget.id}
          name={widget.name}
          description={widget.description}
          onDeleteWidget={() => onDeleteWidget(widget.id)}
          onUpdateWidget={(data) => onUpdateWidget?.(widget.id, data)}
        />
      );

    case "savinggoal":
      return (
        <SavingGoalWidget
          widgetId={widget.id}
          portfolioId={portfolioId}
          name={widget.name}
          description={widget.description}
          targetAmount={widget.targetAmount ?? 0}
          targetDate={widget.targetDate}
          onDeleteWidget={() => onDeleteWidget(widget.id)}
          onUpdateWidget={(data) => onUpdateWidget?.(widget.id, data)}
        />
      );

    case "recurringexpense":
      return (
        <RecurringExpenseWidget
          widgetId={widget.id}
          portfolioId={portfolioId}
          name={widget.name}
          description={widget.description}
          onDeleteWidget={() => onDeleteWidget(widget.id)}
          onUpdateWidget={(data) => onUpdateWidget?.(widget.id, data)}
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
