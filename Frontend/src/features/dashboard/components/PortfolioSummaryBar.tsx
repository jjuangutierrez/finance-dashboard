import { ArrowUpRight, ArrowDownRight, Wallet, Receipt } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { PortfolioSummary } from "@/features/portfolio/types/portfolio.types";

interface PortfolioSummaryBarProps {
  summary: PortfolioSummary | null;
  loading: boolean;
}

export function PortfolioSummaryBar({ summary, loading }: PortfolioSummaryBarProps) {
  if (loading || !summary) {
    return (
      <div className="w-full h-16 bg-muted/20 animate-pulse rounded-xl mb-6 border" />
    );
  }

  return (
    <div className="w-full mb-6">
      <Card className="border shadow-sm bg-card/80 backdrop-blur p-4 rounded-xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 divide-x-0 md:divide-x divide-border">
          <div className="flex items-center gap-3 px-2">
            <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
              <Wallet className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xs text-muted-foreground block font-medium">Net Portfolio Balance</span>
              <span className={`text-lg font-bold ${summary.netBalance >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                ${summary.netBalance.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 px-2">
            <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-500">
              <ArrowUpRight className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xs text-muted-foreground block font-medium">Total Income</span>
              <span className="text-lg font-semibold text-foreground">
                +${summary.totalIncome.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 px-2">
            <div className="p-2.5 rounded-lg bg-red-500/10 text-red-500">
              <ArrowDownRight className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xs text-muted-foreground block font-medium">Total Expenses</span>
              <span className="text-lg font-semibold text-foreground">
                -${summary.totalExpenses.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 px-2">
            <div className="p-2.5 rounded-lg bg-muted text-muted-foreground">
              <Receipt className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xs text-muted-foreground block font-medium">Total Activity</span>
              <span className="text-lg font-semibold text-foreground">
                {summary.totalTransactions} <span className="text-xs font-normal text-muted-foreground">txs</span>
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}