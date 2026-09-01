import { useState, useEffect } from "react";
import {
  CalendarClock,
  GripHorizontal,
  Plus,
  Receipt,
  Trash2,
  AlertCircle,
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

interface RecurringExpenseWidgetProps {
  portfolioId: string;
  widgetId: string;
  name: string;
  description?: string;
  onDeleteWidget?: () => void;
  onUpdateWidget?: (data: { name?: string; description?: string }) => void;
}

export function RecurringExpenseWidget({
  portfolioId,
  widgetId,
  name,
  description,
  onDeleteWidget,
  onUpdateWidget,
}: RecurringExpenseWidgetProps) {
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
      console.error("Error loading recurring expenses:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteTx(txId: string) {
    try {
      await transactionService.delete(portfolioId, widgetId, txId);
      await loadTransactions();
    } catch (error) {
      console.error("Error deleting recurring expense:", error);
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

  const totalMonthly = transactions.reduce((acc, t) => acc + t.amount, 0);

  const sortedExpenses = [...transactions].sort(
    (a, b) => (a.paymentDay ?? 1) - (b.paymentDay ?? 1)
  );

  const currentDay = new Date().getDate();
  const nextBill =
    sortedExpenses.find((t) => (t.paymentDay ?? 1) >= currentDay) ||
    sortedExpenses[0];

  return (
    <>
      <Card className="h-full flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
        {/* Header */}
        <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <div
              className="drag-handle cursor-grab active:cursor-grabbing p-1 -ml-1 text-muted-foreground hover:text-foreground rounded transition-colors shrink-0"
              title="Drag to move"
            >
              <GripHorizontal className="h-5 w-5" />
            </div>

            <div className="min-w-0 flex-1">
              <CardTitle className="text-lg font-bold flex items-center gap-2 h-8">
                <CalendarClock className="h-5 w-5 text-amber-500 shrink-0" />

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
              Add Bill
            </Button>

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

        {/* Content */}
        <CardContent className="space-y-4 flex-1 flex flex-col min-h-0 pb-5">
          {loading ? (
            <div className="h-full bg-muted/20 animate-pulse rounded-xl flex items-center justify-center text-muted-foreground text-xs min-h-[140px]">
              Loading bills...
            </div>
          ) : (
            <>
              {/* Resumen mensual y próxima factura */}
              <div className="bg-muted/30 p-4 rounded-xl border space-y-3 shrink-0">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-xs text-muted-foreground font-medium block mb-0.5">
                      Monthly Commitment
                    </span>
                    <span className="font-bold text-xl md:text-2xl text-foreground tracking-tight">
                      ${totalMonthly.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      <span className="text-xs font-normal text-muted-foreground ml-1.5">/ month</span>
                    </span>
                  </div>

                  <Badge variant="secondary" className="text-xs font-semibold px-2.5 py-0.5">
                    {transactions.length} bills
                  </Badge>
                </div>

                {nextBill && (
                  <div className="flex items-center gap-2 text-xs text-amber-700 dark:text-amber-300 bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20 font-medium">
                    <AlertCircle className="h-4 w-4 shrink-0 text-amber-500" />
                    <span className="truncate">
                      Next: <strong>{nextBill.title}</strong> (${nextBill.amount.toFixed(2)}) on day {nextBill.paymentDay}
                    </span>
                  </div>
                )}
              </div>

              {/* Lista de facturas recurrentes (expansión dinámica) */}
              <div className="space-y-2 flex-1 flex flex-col min-h-0 pt-1">
                <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wider shrink-0">
                  <span className="flex items-center gap-1.5">
                    <Receipt className="h-3.5 w-3.5" /> All Recurring Bills
                  </span>
                  <span>{transactions.length} total</span>
                </div>

                {sortedExpenses.length === 0 ? (
                  <div className="flex-1 border border-dashed rounded-xl p-4 flex flex-col items-center justify-center text-center text-muted-foreground bg-muted/10 min-h-[70px]">
                    <p className="text-xs font-medium">No recurring bills yet.</p>
                    <p className="text-xs text-muted-foreground/80 mt-0.5">Add your rent, Netflix, utilities, etc.</p>
                  </div>
                ) : (
                  <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-0">
                    {sortedExpenses.map((tx) => (
                      <div
                        key={tx.id}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-background border text-sm group hover:border-muted-foreground/30 transition-colors"
                      >
                        <div className="min-w-0 pr-2">
                          <p className="font-medium text-sm text-foreground truncate">{tx.title}</p>
                          <p className="text-xs text-muted-foreground">
                            Charges on day <strong>{tx.paymentDay ?? 1}</strong> of each month
                          </p>
                        </div>
                        <div className="flex items-center gap-2.5 shrink-0">
                          <span className="font-bold text-sm text-foreground tracking-tight">
                            ${tx.amount.toFixed(2)}
                          </span>
                          <button
                            onClick={() => handleDeleteTx(tx.id)}
                            className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-600 transition-opacity cursor-pointer p-1 rounded hover:bg-muted"
                            title="Delete bill"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <CreateTransactionDialog
        isOpen={isTxModalOpen}
        onClose={() => setIsTxModalOpen(false)}
        portfolioId={portfolioId}
        widgetId={widgetId}
        widgetKind="recurringexpense"
        onTransactionCreated={loadTransactions}
      />
    </>
  );
}