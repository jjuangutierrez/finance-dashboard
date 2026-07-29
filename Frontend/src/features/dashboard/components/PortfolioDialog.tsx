import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Portfolio } from "@/features/portfolio/types/portfolio.types";

interface PortfolioDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingPortfolio: Portfolio | null;
  onSave: (title: string) => Promise<void>;
}

export function PortfolioDialog({ open, onOpenChange, editingPortfolio, onSave }: PortfolioDialogProps) {
  const [titleInput, setTitleInput] = useState("");

  useEffect(() => {
    setTitleInput(editingPortfolio?.title ?? "");
  }, [editingPortfolio, open]);

  async function handleSave() {
    if (!titleInput.trim()) return;
    await onSave(titleInput);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editingPortfolio ? "Rename Portfolio" : "Create New Portfolio"}
          </DialogTitle>
        </DialogHeader>

        <div className="py-2">
          <Input
            placeholder="Portfolio Title (e.g., Vacation Savings)"
            value={titleInput}
            onChange={(e) => setTitleInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            autoFocus
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {editingPortfolio ? "Save Changes" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}