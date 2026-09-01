import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { transactionService } from "../services/transaction.service";
import type { TransactionType } from "../types/transaction.types";
import type { WidgetKind } from "../../widget/types/widget.types";

interface CreateTransactionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  portfolioId: string;
  widgetId: string;
  widgetKind: WidgetKind;
  onTransactionCreated: () => void;
}

export function CreateTransactionDialog({
  isOpen,
  onClose,
  portfolioId,
  widgetId,
  widgetKind,
  onTransactionCreated,
}: CreateTransactionDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<TransactionType>("expense");
  const [paymentDay, setPaymentDay] = useState("1");
  const [submitting, setSubmitting] = useState(false);

  const isRecurring = widgetKind === "recurringexpense";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);

    if (!title.trim() || isNaN(parsedAmount) || parsedAmount <= 0) {
      alert("Please enter a valid title and a positive amount.");
      return;
    }

    try {
      setSubmitting(true);
      await transactionService.create(portfolioId, widgetId, {
        title,
        description: description.trim() || undefined,
        amount: parsedAmount,
        type,
        paymentDay: isRecurring ? parseInt(paymentDay, 10) : undefined,
      });

      // Reset Form
      setTitle("");
      setDescription("");
      setAmount("");
      setType("expense");
      setPaymentDay("1");

      onTransactionCreated();
      onClose();
    } catch (error) {
      console.error("Error creating transaction:", error);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Transaction</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="e.g. Spotify, Salary, Groceries"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
            />
          </div>

          {/* Amount & Type */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="amount">Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="type">Type</Label>
              <Select
                value={type}
                onValueChange={(val) => setType(val as TransactionType)}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="expense">Expense (-)</SelectItem>
                  <SelectItem value="income">Income (+)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {isRecurring && (
            <div className="space-y-1.5">
              <Label htmlFor="paymentDay">Billed Day of Month (1 - 28)</Label>
              <Input
                id="paymentDay"
                type="number"
                min="1"
                max="28"
                value={paymentDay}
                onChange={(e) => setPaymentDay(e.target.value)}
                required
              />
            </div>
          )}

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="description">Description (Optional)</Label>
            <Input
              id="description"
              placeholder="Additional details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Saving..." : "Add Transaction"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}