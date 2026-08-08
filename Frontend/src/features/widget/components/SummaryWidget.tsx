import { useState } from "react";
import {
  Wallet,
  GripHorizontal,
  Trash2,
  ListFilter,
  ArrowUpRight,
  ArrowDownRight,
  Receipt,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AllTransactionsDialog } from "../../transactions/components/AllTransactionsDialog";
import type { PortfolioSummary } from "@/features/portfolio/types/portfolio.types";
import type { Widget } from "@/features/widget/types/widget.types";

interface SummaryWidgetProps {
  portfolioId: string;
  widgetId: string;
  name: string;
  description?: string;
  summary: PortfolioSummary | null;
  loading: boolean;
  widgets?: Widget[];
  onDeleteWidget?: () => void;
}

export function SummaryWidget({
  portfolioId,
  widgetId,
  name,
  description,
  summary,
  loading,
  widgets = [],
  onDeleteWidget,
}: SummaryWidgetProps) {
  const [isAllTxModalOpen, setIsAllTxModalOpen] = useState(false);

  return (
    <>
      <Card className="h-full flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-2 flex flex-row items-start justify-between space-y-0">
          <div className="flex items-center gap-2">
            <div
              className="drag-handle cursor-grab active:cursor-grabbing p-1 -ml-1 text-muted-foreground hover:text-foreground rounded transition-colors"
              title="Drag to move"
            >
              <GripHorizontal className="h-4 w-4" />
            </div>

            <div>
              <CardTitle className="text-base font-semibold flex items-center gap-1.5">
                <Wallet className="h-4 w-4 text-primary" />
                {name}
              </CardTitle>
              {description && (
                <CardDescription className="text-xs truncate max-w-[200px]">
                  {description}
                </CardDescription>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs gap-1 cursor-pointer"
              onClick={() => setIsAllTxModalOpen(true)}
            >
              <ListFilter className="h-3.5 w-3.5" />
              View All
            </Button>

            {onDeleteWidget && (
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 text-muted-foreground hover:text-red-600"
                onClick={onDeleteWidget}
                title="Delete widget"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4 flex-1 flex flex-col justify-center text-xs">
          {loading || !summary ? (
            <div className="h-20 bg-muted/20 animate-pulse rounded-lg flex items-center justify-center text-muted-foreground text-[11px]">
              Loading summary metrics...
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-muted/30 p-3 rounded-lg border">
              {/* Balance Neto */}
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-md bg-primary/10 text-primary shrink-0">
                  <Wallet className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] text-muted-foreground block font-medium truncate">
                    Net Balance
                  </span>
                  <span
                    className={`font-bold text-sm truncate block ${
                      summary.netBalance >= 0 ? "text-emerald-600" : "text-red-600"
                    }`}
                  >
                    ${summary.netBalance.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-md bg-emerald-500/10 text-emerald-500 shrink-0">
                  <ArrowUpRight className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] text-muted-foreground block font-medium truncate">
                    Total Income
                  </span>
                  <span className="font-semibold text-xs text-foreground truncate block">
                    +${summary.totalIncome.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Gastos */}
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-md bg-red-500/10 text-red-500 shrink-0">
                  <ArrowDownRight className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] text-muted-foreground block font-medium truncate">
                    Total Expenses
                  </span>
                  <span className="font-semibold text-xs text-foreground truncate block">
                    -${summary.totalExpenses.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-md bg-muted text-muted-foreground shrink-0">
                  <Receipt className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] text-muted-foreground block font-medium truncate">
                    Total Activity
                  </span>
                  <span className="font-semibold text-xs text-foreground truncate block">
                    {summary.totalTransactions}{" "}
                    <span className="text-[10px] font-normal text-muted-foreground">txs</span>
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <AllTransactionsDialog
        isOpen={isAllTxModalOpen}
        onClose={() => setIsAllTxModalOpen(false)}
        portfolioId={portfolioId}
        widgets={widgets}
      />
    </>
  );
}