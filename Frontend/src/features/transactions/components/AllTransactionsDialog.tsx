import { useState, useEffect, useMemo } from "react";
import { Search, Receipt, ArrowUpRight, ArrowDownRight, Layers, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { transactionService } from "@/features/transactions/services/transaction.service";
import { portfolioService } from "@/features/portfolios/services/portfolio.service";
import type { Transaction } from "@/features/transactions/types/transaction.types";
import type { Widget } from "@/features/widget/types/widget.types";

export interface ExtendedTransaction extends Transaction {
  widgetName: string;
}

interface AllTransactionsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  portfolioId: string;
  widgets?: Widget[];
}

export function AllTransactionsDialog({
  isOpen,
  onClose,
  portfolioId,
  widgets = [],
}: AllTransactionsDialogProps) {
  const [transactions, setTransactions] = useState<ExtendedTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (isOpen && portfolioId) {
      loadAllTransactions();
    }
  }, [isOpen, portfolioId]);

  async function loadAllTransactions() {
    setLoading(true);
    try {
      if (typeof (portfolioService as any).getTransactions === "function") {
        const data = await (portfolioService as any).getTransactions(portfolioId);
        setTransactions(data);
        return;
      }

      const validWidgets = widgets.filter(
        (w) => w.kind === "tracker" || w.kind === "recurringexpense" || w.kind === "savinggoal"
      );

      const promises = validWidgets.map(async (widget) => {
        try {
          const txs = await transactionService.getByWidget(portfolioId, widget.id);
          return txs.map((tx) => ({
            ...tx,
            widgetName: widget.name,
          }));
        } catch {
          return [];
        }
      });

      const results = await Promise.all(promises);
      setTransactions(results.flat());
    } catch (error) {
      console.error("Error fetching portfolio transactions:", error);
    } finally {
      setLoading(false);
    }
  }

  const filteredTransactions = useMemo(() => {
    if (!searchQuery.trim()) return transactions;
    const query = searchQuery.toLowerCase();
    return transactions.filter(
      (tx) =>
        tx.title.toLowerCase().includes(query) ||
        (tx.description && tx.description.toLowerCase().includes(query)) ||
        (tx.widgetName && tx.widgetName.toLowerCase().includes(query))
    );
  }, [transactions, searchQuery]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl w-[95vw] max-h-[85vh] flex flex-col p-6 gap-4 sm:rounded-xl">
        <DialogHeader className="pr-6">
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
            <Receipt className="h-5 w-5 text-primary" />
            All Portfolio Transactions
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Complete list of transactions recorded across all widgets in this portfolio.
          </DialogDescription>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions by name or tracker..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-8 text-sm h-9"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto pr-1 space-y-2 min-h-[280px] max-h-[50vh]">
          {loading ? (
            <div className="flex items-center justify-center h-48 text-xs text-muted-foreground">
              Loading transactions...
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 border border-dashed rounded-lg text-muted-foreground text-center p-4">
              <Receipt className="h-8 w-8 mb-2 opacity-40" />
              <p className="text-xs font-medium">No transactions found</p>
              <p className="text-[11px] text-muted-foreground">
                {searchQuery
                  ? "Try searching with a different term."
                  : "No transactions have been added to any widget yet."}
              </p>
            </div>
          ) : (
            filteredTransactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/40 transition-colors gap-3 group"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div
                    className={`p-2 rounded-lg shrink-0 ${
                      tx.type === "income"
                        ? "bg-emerald-500/10 text-emerald-600"
                        : "bg-red-500/10 text-red-600"
                    }`}
                  >
                    {tx.type === "income" ? (
                      <ArrowUpRight className="h-4 w-4" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4" />
                    )}
                  </div>

                  <div className="flex flex-col min-w-0">
                    <span className="font-medium text-xs text-foreground truncate">
                      {tx.title}
                    </span>
                    {tx.description && (
                      <span className="text-[10px] text-muted-foreground truncate">
                        {tx.description}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <Badge variant="secondary" className="gap-1 text-[10px] font-normal py-0.5">
                    <Layers className="h-3 w-3 text-muted-foreground" />
                    <span className="truncate max-w-[100px]">
                      {tx.widgetName || "Tracker"}
                    </span>
                  </Badge>

                  <span
                    className={`font-semibold text-xs min-w-[70px] text-right ${
                      tx.type === "income" ? "text-emerald-600" : "text-red-600"
                    }`}
                  >
                    {tx.type === "income" ? "+" : "-"}${tx.amount.toFixed(2)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex items-center justify-between border-t pt-3 text-[11px] text-muted-foreground">
          <span>
            Showing <strong className="text-foreground">{filteredTransactions.length}</strong> of{" "}
            {transactions.length} transactions
          </span>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-7 text-xs">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}