import { useState } from "react";
import {
  Wallet,
  GripHorizontal,
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
import type { PortfolioSummary } from "@/features/portfolios/types/portfolio.types";
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
  onUpdateWidget?: (data: { name?: string; description?: string }) => void;
}

export function SummaryWidget({
  portfolioId,
  name,
  description,
  summary,
  loading,
  widgets = [],
  onDeleteWidget,
  onUpdateWidget,
}: SummaryWidgetProps) {
  const [isAllTxModalOpen, setIsAllTxModalOpen] = useState(false);

  return (
    <>
      <Card className="h-full flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-2">
            <div
              className="drag-handle cursor-grab active:cursor-grabbing p-1 -ml-1 text-muted-foreground hover:text-foreground rounded transition-colors"
              title="Drag to move"
            >
              <GripHorizontal className="h-5 w-5" />
            </div>

            <div>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Wallet className="h-5 w-5 text-primary" />
                {name}
              </CardTitle>
              {description && (
                <CardDescription className="text-xs truncate max-w-[250px]">
                  {description}
                </CardDescription>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="outline"
              className="h-8 text-xs font-medium gap-1.5 cursor-pointer px-3"
              onClick={() => setIsAllTxModalOpen(true)}
            >
              <ListFilter className="h-4 w-4" />
              View All
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col justify-center pb-5">
          {loading || !summary ? (
            <div className="h-24 bg-muted/20 animate-pulse rounded-xl flex items-center justify-center text-muted-foreground text-sm">
              Loading summary metrics...
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 bg-muted/30 p-4 rounded-xl border">
              {/*
                Net Balance / Total Spent
                When the user has no recorded income, "netBalance" is just
                `0 - totalExpenses` — that's not really a balance, it's just
                how much they've logged spending. Showing that in red implies
                a deficit that doesn't actually exist; it's just an
                expense-only tracker for this portfolio. So: only treat it as
                a real balance (with emerald/red semantics) once there's
                income to balance against.
              */}
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-primary/10 text-primary shrink-0">
                  <Wallet className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs text-muted-foreground block font-medium truncate mb-0.5">
                    {summary.totalIncome > 0 ? "Net Balance" : "Total Spent"}
                  </span>
                  <span
                    className={`font-bold text-lg md:text-xl truncate block tracking-tight ${
                      summary.totalIncome === 0
                        ? "text-foreground"
                        : summary.netBalance >= 0
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    ${Math.abs(summary.netBalance).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Total Income */}
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                  <ArrowUpRight className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs text-muted-foreground block font-medium truncate mb-0.5">
                    Total Income
                  </span>
                  <span className="font-bold text-base md:text-lg text-foreground truncate block tracking-tight">
                    +${summary.totalIncome.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Total Expenses */}
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 shrink-0">
                  <ArrowDownRight className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs text-muted-foreground block font-medium truncate mb-0.5">
                    Total Expenses
                  </span>
                  <span className="font-bold text-base md:text-lg text-foreground truncate block tracking-tight">
                    -${summary.totalExpenses.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Activity */}
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-muted text-muted-foreground shrink-0 border border-border/50">
                  <Receipt className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs text-muted-foreground block font-medium truncate mb-0.5">
                    Total Activity
                  </span>
                  <span className="font-bold text-base md:text-lg text-foreground truncate block tracking-tight">
                    {summary.totalTransactions}{" "}
                    <span className="text-xs font-normal text-muted-foreground">txs</span>
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