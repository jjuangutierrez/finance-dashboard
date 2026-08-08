import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  GripHorizontal,
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
}

export function TrackerWidget({
  portfolioId,
  widgetId,
  name,
  description,
  onDeleteWidget, 
}: TrackerWidgetProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);

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

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);

  const netBalance = totalIncome - totalExpenses;

  const chartData = transactions
    .filter((t) => t.type === "expense")
    .map((t) => ({
      name: t.title,
      amount: t.amount,
    }));

  return (
    <>
      <Card className="h-full flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
        {/* Header del Widget */}
        <CardHeader className="pb-2 flex flex-row items-start justify-between space-y-0">
          <div className="flex items-center gap-2">
            {/* 🟢 Manija de Arrastre */}
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
                <CardDescription className="text-xs truncate max-w-[180px]">
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
              onClick={() => setIsTxModalOpen(true)}
            >
              <Plus className="h-3.5 w-3.5" />
              Add
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

        <CardContent className="space-y-4 flex-1 overflow-auto text-xs">
          <div className="grid grid-cols-3 gap-2 bg-muted/30 p-2.5 rounded-lg border">
            <div>
              <span className="text-[10px] text-muted-foreground block">
                Net Balance
              </span>
              <span
                className={`font-bold text-sm ${netBalance >= 0 ? "text-emerald-600" : "text-red-600"}`}
              >
                ${netBalance.toFixed(2)}
              </span>
            </div>

            <div>
              <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                <ArrowUpRight className="h-3 w-3 text-emerald-500" /> Income
              </span>
              <span className="font-semibold text-xs text-foreground">
                +${totalIncome.toFixed(2)}
              </span>
            </div>

            <div>
              <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                <ArrowDownRight className="h-3 w-3 text-red-500" /> Expenses
              </span>
              <span className="font-semibold text-xs text-foreground">
                -${totalExpenses.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Gráfico de Barras / Donut */}
          <TrackerChart data={chartData} />

          {/* Lista comprimida de Transacciones recientes */}
          <div className="space-y-1 pt-2">
            <span className="text-[11px] font-semibold text-muted-foreground block mb-1">
              Transactions ({transactions.length})
            </span>

            {loading ? (
              <p className="text-muted-foreground text-[10px]">Loading...</p>
            ) : transactions.length === 0 ? (
              <p className="text-muted-foreground text-[10px] italic">
                No transactions recorded yet.
              </p>
            ) : (
              <div className="max-h-32 overflow-y-auto space-y-1.5 pr-1">
                {transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-1.5 rounded-md bg-background border text-xs group"
                  >
                    <div className="flex flex-col truncate">
                      <span className="font-medium truncate">{tx.title}</span>
                      {tx.description && (
                        <span className="text-[10px] text-muted-foreground truncate">
                          {tx.description}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={
                          tx.type === "income"
                            ? "text-emerald-600 border-emerald-200"
                            : "text-red-600 border-red-200"
                        }
                      >
                        {tx.type === "income" ? "+" : "-"}$
                        {tx.amount.toFixed(2)}
                      </Badge>

                      <button
                        onClick={() => handleDeleteTx(tx.id)}
                        className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-600 transition-opacity"
                        title="Delete transaction"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modal para agregar nueva transacción */}
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
