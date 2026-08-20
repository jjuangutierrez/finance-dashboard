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
        <CardHeader className="pb-3 flex flex-row items-start justify-between space-y-0">
          <div className="flex items-center gap-2 min-w-0">
            <div
              className="drag-handle cursor-grab active:cursor-grabbing p-1 -ml-1 text-muted-foreground hover:text-foreground rounded transition-colors shrink-0"
              title="Drag to move"
            >
              <GripHorizontal className="h-4 w-4" />
            </div>

            <div className="min-w-0 flex-1">
              <CardTitle className="text-base font-semibold flex items-center gap-1.5 h-7">
                <CalendarClock className="h-4 w-4 text-amber-500 shrink-0" />

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
                    className="h-7 text-xs font-semibold px-2 py-0 w-44"
                    autoFocus
                  />
                ) : (
                  <span
                    onClick={() => onUpdateWidget && setIsEditingTitle(true)}
                    className="cursor-pointer hover:underline flex items-center gap-1.5 truncate group"
                    title="Click to rename"
                  >
                    <span className="truncate">{name}</span>
                    {onUpdateWidget && (
                      <Pencil className="h-3 w-3 opacity-0 group-hover:opacity-100 text-muted-foreground transition-opacity shrink-0" />
                    )}
                  </span>
                )}
              </CardTitle>

              {description && (
                <CardDescription className="text-xs truncate max-w-[200px]">
                  {description}
                </CardDescription>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs gap-1 cursor-pointer"
              onClick={() => setIsTxModalOpen(true)}
            >
              <Plus className="h-3.5 w-3.5" />
              Add Bill
            </Button>

            {onDeleteWidget && (
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 text-muted-foreground hover:text-destructive cursor-pointer"
                onClick={onDeleteWidget}
                title="Delete widget"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </CardHeader>

        {/* Content */}
        <CardContent className="space-y-4 flex-1 flex flex-col justify-between text-xs">
          {loading ? (
            <div className="h-32 bg-muted/20 animate-pulse rounded-lg flex items-center justify-center text-muted-foreground text-[11px]">
              Loading bills...
            </div>
          ) : (
            <>
              {/* Resumen mensual y próxima factura */}
              <div className="bg-muted/30 p-3.5 rounded-lg border space-y-2">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold block">
                      Monthly Commitment
                    </span>
                    <span className="font-bold text-lg text-foreground">
                      ${totalMonthly.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      <span className="text-[10px] font-normal text-muted-foreground ml-1">/ month</span>
                    </span>
                  </div>

                  <Badge variant="secondary" className="text-xs font-semibold px-2 py-0.5">
                    {transactions.length} bills
                  </Badge>
                </div>

                {nextBill && (
                  <div className="flex items-center gap-1.5 text-[11px] text-amber-600 bg-amber-500/10 p-2 rounded border border-amber-500/20 font-medium">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">
                      Next: <strong>{nextBill.title}</strong> (${nextBill.amount}) on day {nextBill.paymentDay}
                    </span>
                  </div>
                )}
              </div>

              {/* Lista de facturas recurrentes */}
              <div className="space-y-2 flex-1 flex flex-col">
                <div className="flex items-center justify-between text-[11px] font-medium text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Receipt className="h-3.5 w-3.5" /> All Recurring Bills
                  </span>
                </div>

                {sortedExpenses.length === 0 ? (
                  <div className="flex-1 border border-dashed rounded-md p-3 flex flex-col items-center justify-center text-center text-muted-foreground bg-muted/10 min-h-[60px]">
                    <p className="text-[11px]">No recurring bills yet.</p>
                    <p className="text-[10px]">Add your rent, Netflix, utilities, etc.</p>
                  </div>
                ) : (
                  <div className="space-y-1.5 max-h-[120px] overflow-y-auto pr-1">
                    {sortedExpenses.map((tx) => (
                      <div
                        key={tx.id}
                        className="flex items-center justify-between p-2 rounded bg-background border text-[11px] group"
                      >
                        <div className="min-w-0 pr-2">
                          <p className="font-medium text-foreground truncate">{tx.title}</p>
                          <p className="text-[10px] text-muted-foreground">
                            Charges on day <strong>{tx.paymentDay ?? 1}</strong> of each month
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="font-semibold text-foreground">
                            ${tx.amount.toFixed(2)}
                          </span>
                          <button
                            onClick={() => handleDeleteTx(tx.id)}
                            className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-600 transition-opacity cursor-pointer"
                            title="Delete bill"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
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
        widgetKind="recurring_expense"
        onTransactionCreated={loadTransactions}
      />
    </>
  );
}