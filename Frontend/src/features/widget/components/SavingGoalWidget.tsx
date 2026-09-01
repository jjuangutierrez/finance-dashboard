import { useState, useEffect } from "react";
import {
  Target,
  GripHorizontal,
  Plus,
  Calendar,
  CheckCircle2,
  Receipt,
  Trash2,
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
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

import { transactionService } from "@/features/transactions/services/transaction.service";
import { CreateTransactionDialog } from "@/features/transactions/components/CreateTransactionDialog";
import type { Transaction } from "@/features/transactions/types/transaction.types";

interface SavingGoalWidgetProps {
  portfolioId: string;
  widgetId: string;
  name: string;
  description?: string;
  targetAmount: number;
  targetDate?: string | null;
  onDeleteWidget?: () => void;
  onUpdateWidget?: (data: {
    name?: string;
    description?: string;
    targetAmount?: number;
    targetDate?: string | null;
  }) => void;
}

export function SavingGoalWidget({
  portfolioId,
  widgetId,
  name,
  description,
  targetAmount = 0,
  targetDate,
  onDeleteWidget,
  onUpdateWidget,
}: SavingGoalWidgetProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(name);

  const [isEditingTarget, setIsEditingTarget] = useState(false);
  const [targetValue, setTargetValue] = useState(targetAmount.toString());

  const [isEditingDate, setIsEditingDate] = useState(false);
  const [dateValue, setDateValue] = useState(targetDate ?? "");

  useEffect(() => {
    setTitleValue(name);
  }, [name]);

  useEffect(() => {
    setTargetValue(targetAmount.toString());
  }, [targetAmount]);

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

  const handleSaveTarget = () => {
    setIsEditingTarget(false);
    const parsed = parseFloat(targetValue);
    if (!isNaN(parsed) && parsed >= 0 && parsed !== targetAmount) {
      onUpdateWidget?.({ targetAmount: parsed });
    } else {
      setTargetValue(targetAmount.toString());
    }
  };

  const handleSaveDate = (newDate: string) => {
    setIsEditingDate(false);
    setDateValue(newDate);
    if (newDate !== targetDate) {
      onUpdateWidget?.({ targetDate: newDate ? newDate : null });
    }
  };

  const currentAmount = transactions.reduce((acc, t) => {
    return t.type === "expense" ? acc - t.amount : acc + t.amount;
  }, 0);

  const progressPercentage =
    targetAmount > 0
      ? Math.min(Math.round((currentAmount / targetAmount) * 100), 100)
      : 0;

  const isCompleted = currentAmount >= targetAmount && targetAmount > 0;
  const remainingAmount = Math.max(targetAmount - currentAmount, 0);

  const formattedDate = targetDate
    ? new Date(targetDate).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

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
                <Target className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />

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
              Deposit
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
              Loading goal metrics...
            </div>
          ) : (
            <>
              <div className="bg-muted/30 p-4 rounded-xl border space-y-3 shrink-0">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-xs text-muted-foreground font-medium block mb-0.5">
                      Saved so far
                    </span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-bold text-xl md:text-2xl text-foreground tracking-tight">
                        ${currentAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </span>

                      {/* Target */}
                      {isEditingTarget ? (
                        <div className="inline-flex items-center">
                          <span className="text-muted-foreground text-sm mr-1">/ $</span>
                          <Input
                            type="number"
                            value={targetValue}
                            onChange={(e) => setTargetValue(e.target.value)}
                            onBlur={handleSaveTarget}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleSaveTarget();
                              if (e.key === "Escape") {
                                setTargetValue(targetAmount.toString());
                                setIsEditingTarget(false);
                              }
                            }}
                            className="h-7 text-xs px-2 py-0 w-28"
                            autoFocus
                          />
                        </div>
                      ) : (
                        <span
                          onClick={() => onUpdateWidget && setIsEditingTarget(true)}
                          className="text-muted-foreground text-sm font-medium hover:text-foreground cursor-pointer hover:underline flex items-center gap-1 group"
                          title="Click to edit target goal"
                        >
                          / ${targetAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                          <Pencil className="h-3 w-3 opacity-0 group-hover:opacity-100 text-muted-foreground" />
                        </span>
                      )}
                    </div>
                  </div>

                  <Badge
                    variant={isCompleted ? "default" : "secondary"}
                    className={`text-xs px-2.5 py-0.5 font-semibold ${
                      isCompleted ? "bg-emerald-600 hover:bg-emerald-700 text-white" : ""
                    }`}
                  >
                    {isCompleted ? (
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Completed
                      </span>
                    ) : (
                      `${progressPercentage}%`
                    )}
                  </Badge>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5">
                  <Progress value={progressPercentage} className="h-2.5 rounded-full" />
                  <div className="flex justify-between items-center text-xs text-muted-foreground pt-0.5">
                    <span className="font-medium">
                      {isCompleted
                        ? "Goal reached! 🎉"
                        : `$${remainingAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })} left`}
                    </span>

                    {/* Edición en línea de la FECHA (Target Date) */}
                    {isEditingDate ? (
                      <Input
                        type="date"
                        value={dateValue}
                        onChange={(e) => handleSaveDate(e.target.value)}
                        onBlur={() => setIsEditingDate(false)}
                        className="h-6 text-xs px-1.5 py-0 w-32"
                        autoFocus
                      />
                    ) : (
                      <span
                        onClick={() => onUpdateWidget && setIsEditingDate(true)}
                        className="flex items-center gap-1.5 hover:text-foreground cursor-pointer hover:underline font-medium"
                        title="Click to set/change target date"
                      >
                        <Calendar className="h-3.5 w-3.5" />
                        {formattedDate ? `Target: ${formattedDate}` : "+ Set target date"}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2 flex-1 flex flex-col min-h-0 pt-1">
                <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wider shrink-0">
                  <span className="flex items-center gap-1.5">
                    <Receipt className="h-3.5 w-3.5" /> Recent Contributions
                  </span>
                  <span>{transactions.length} total</span>
                </div>

                {transactions.length === 0 ? (
                  <div className="flex-1 border border-dashed rounded-xl p-4 flex flex-col items-center justify-center text-center text-muted-foreground bg-muted/10 min-h-[70px]">
                    <p className="text-xs font-medium">No contributions yet.</p>
                    <p className="text-xs text-muted-foreground/80 mt-0.5">Add your first deposit to start saving!</p>
                  </div>
                ) : (
                  <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-0">
                    {transactions.map((tx) => (
                      <div
                        key={tx.id}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-background border text-sm group hover:border-muted-foreground/30 transition-colors"
                      >
                        <div className="min-w-0 pr-2">
                          <p className="font-medium text-sm text-foreground truncate">{tx.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(tx.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2.5 shrink-0">
                          <span
                            className={`font-semibold text-sm ${
                              tx.type === "expense"
                                ? "text-red-600 dark:text-red-400"
                                : "text-emerald-600 dark:text-emerald-400"
                            }`}
                          >
                            {tx.type === "expense" ? "-" : "+"}
                            ${tx.amount.toFixed(2)}
                          </span>
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
            </>
          )}
        </CardContent>
      </Card>

      <CreateTransactionDialog
        isOpen={isTxModalOpen}
        onClose={() => setIsTxModalOpen(false)}
        portfolioId={portfolioId}
        widgetId={widgetId}
        widgetKind="savinggoal"
        onTransactionCreated={loadTransactions}
      />
    </>
  );
}