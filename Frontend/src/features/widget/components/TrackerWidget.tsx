import { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Trash2,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  GripHorizontal,
  Pencil,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

import { transactionService } from "@/features/transactions/services/transaction.service";
import { CreateTransactionDialog } from "@/features/transactions/components/CreateTransactionDialog";
import type { Transaction } from "@/features/transactions/types/transaction.types";
import { TrackerChart } from "./TrackerChart";

interface TrackerWidgetProps {
  portfolioId: string;
  widgetId: string;
  name: string;
  description?: string;
  onDeleteWidget?: () => void;
  onUpdateWidget?: (data: { name?: string; description?: string }) => void;
}

export function TrackerWidget({
  portfolioId,
  widgetId,
  name,
  description,
  onDeleteWidget,
  onUpdateWidget,
}: TrackerWidgetProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(name);

  useEffect(() => {
    setTitleValue(name);
  }, [name]);

  useEffect(() => {
    loadTransactions();
  }, [widgetId]);

  async function loadTransactions() {
    try {
      setLoading(true);
      const data = await transactionService.getByWidget(portfolioId, widgetId);
      setTransactions(data);
    } catch (error) {
      console.error("Error loading transactions:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteTx(txId: string) {
    try {
      await transactionService.delete(portfolioId, widgetId, txId);
      await loadTransactions();
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  }

  const handleSaveTitle = () => {
    setIsEditingTitle(false);
    const trimmed = titleValue.trim();
    if (trimmed && trimmed !== name) {
      onUpdateWidget?.({ name: trimmed });
    } else {
      setTitleValue(name);
    }
  };

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);

  const hasIncome = totalIncome > 0;
  const netBalance = totalIncome - totalExpenses;

  const netLabel = hasIncome ? "Net Balance" : "Total Spent";
  const netValue = hasIncome ? netBalance : totalExpenses;
  const netColorClass = !hasIncome
    ? "text-foreground"
    : netBalance >= 0
      ? "text-emerald-600 dark:text-emerald-400"
      : "text-red-600 dark:text-red-400";
  const netSign = !hasIncome ? "-" : netBalance >= 0 ? "" : "-";

  const chartData = useMemo(() => {
    return transactions.map((t) => ({
      id: t.id,
      name: t.title,
      amount: t.amount,
      type: t.type as "income" | "expense",
    }));
  }, [transactions]);

  return (
    <>
      <Card className="h-full flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-2 min-w-0">
            <div
              className="drag-handle cursor-grab active:cursor-grabbing p-1 -ml-1 text-muted-foreground hover:text-foreground rounded transition-colors shrink-0"
              title="Drag to move"
            >
              <GripHorizontal className="h-5 w-5" />
            </div>

            <div className="min-w-0 flex-1">
              <CardTitle className="text-lg font-bold flex items-center gap-2 h-8">
                <Wallet className="h-5 w-5 text-primary shrink-0" />

                {isEditingTitle ? (
                  <Input
                    value={titleValue}
                    onChange={(e) => setTitleValue(e.target.value)}
                    onBlur={handleSaveTitle}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSaveTitle();
                      if (e.key === "Escape") {
                        setTitleValue(name);
                        setIsEditingTitle(false);
                      }
                    }}
                    className="h-8 text-sm font-semibold px-2.5 py-0 w-48"
                    autoFocus
                  />
                ) : (
                  <span
                    onClick={() => onUpdateWidget && setIsEditingTitle(true)}
                    className="cursor-pointer hover:underline flex items-center gap-2 truncate group"
                    title="Click to rename"
                  >
                    <span className="truncate">{name}</span>
                    {onUpdateWidget && (
                      <Pencil className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 text-muted-foreground transition-opacity shrink-0" />
                    )}
                  </span>
                )}
              </CardTitle>

              {description && (
                <CardDescription className="text-xs truncate max-w-[220px]">
                  {description}
                </CardDescription>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              size="sm"
              variant="outline"
              className="h-8 text-xs font-medium gap-1.5 cursor-pointer px-3"
              onClick={() => setIsTxModalOpen(true)}
            >
              <Plus className="h-4 w-4" />
              Add
            </Button>

            {onUpdateWidget && (
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer"
                onClick={() => setIsEditingTitle((prev) => !prev)}
                title="Rename widget"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}

            {onDeleteWidget && (
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-muted-foreground hover:text-red-600 cursor-pointer"
                onClick={onDeleteWidget}
                title="Delete widget"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4 flex-1 flex flex-col min-h-0 pb-5">
          <div className="grid grid-cols-3 gap-3 bg-muted/30 p-3.5 rounded-xl border shrink-0">
            <div>
              <span className="text-xs text-muted-foreground block font-medium mb-0.5">
                {netLabel}
              </span>
              <span
                className={`font-bold text-base md:text-lg block tracking-tight ${netColorClass}`}
              >
                {netSign}${Math.abs(netValue).toFixed(2)}
              </span>
            </div>

            <div>
              <span className="text-xs text-muted-foreground flex items-center gap-1 font-medium mb-0.5">
                <ArrowUpRight className="h-3.5 w-3.5 text-emerald-500 shrink-0" />{" "}
                Income
              </span>
              <span className="font-bold text-sm md:text-base text-foreground block tracking-tight">
                +${totalIncome.toFixed(2)}
              </span>
            </div>

            <div>
              <span className="text-xs text-muted-foreground flex items-center gap-1 font-medium mb-0.5">
                <ArrowDownRight className="h-3.5 w-3.5 text-red-500 shrink-0" />{" "}
                Expenses
              </span>
              <span className="font-bold text-sm md:text-base text-foreground block tracking-tight">
                -${totalExpenses.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="shrink-0">
            <TrackerChart data={chartData} />
          </div>

          {/* Transaction list */}
          <div className="space-y-2 pt-1 flex-1 flex flex-col min-h-0">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block shrink-0">
              Transactions ({transactions.length})
            </span>

            {loading ? (
              <p className="text-muted-foreground text-xs py-2">
                Loading transactions...
              </p>
            ) : transactions.length === 0 ? (
              <p className="text-muted-foreground text-xs italic py-2">
                No transactions recorded yet.
              </p>
            ) : (
              <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-56">
                {transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-background border text-sm group hover:border-muted-foreground/30 transition-colors"
                  >
                    <div className="flex flex-col truncate pr-2">
                      <span className="font-medium text-sm truncate text-foreground">
                        {tx.title}
                      </span>
                      {tx.description && (
                        <span className="text-xs text-muted-foreground truncate">
                          {tx.description}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                      <Badge
                        variant="outline"
                        className={`text-xs font-semibold px-2.5 py-0.5 ${
                          tx.type === "income"
                            ? "text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30"
                            : "text-red-600 dark:text-red-400 border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/30"
                        }`}
                      >
                        {tx.type === "income" ? "+" : "-"}$
                        {tx.amount.toFixed(2)}
                      </Badge>

                      <button
                        onClick={() => handleDeleteTx(tx.id)}
                        className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-600 transition-opacity cursor-pointer p-1 rounded hover:bg-muted"
                        title="Delete transaction"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <CreateTransactionDialog
        isOpen={isTxModalOpen}
        onClose={() => setIsTxModalOpen(false)}
        portfolioId={portfolioId}
        widgetId={widgetId}
        widgetKind="tracker"
        onTransactionCreated={loadTransactions}
      />
    </>
  );
}
