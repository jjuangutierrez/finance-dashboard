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
import { Loader2 } from "lucide-react";
import type { Portfolio } from "@/features/portfolios/types/portfolio.types";

interface PortfolioDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingPortfolio: Portfolio | null;
  onSave: (title: string) => Promise<void>;
  isSaving?: boolean;
}

export function PortfolioDialog({
  open,
  onOpenChange,
  editingPortfolio,
  onSave,
  isSaving = false,
}: PortfolioDialogProps) {
  const [titleInput, setTitleInput] = useState("");

  useEffect(() => {
    setTitleInput(editingPortfolio?.title ?? "");
  }, [editingPortfolio, open]);

  async function handleSave() {
    if (!titleInput.trim() || isSaving) return;
    await onSave(titleInput.trim());
  }

  return (
    <Dialog open={open} onOpenChange={isSaving ? () => {} : onOpenChange}>
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
            disabled={isSaving}
            autoFocus
          />
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={isSaving || !titleInput.trim()}
          >
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSaving
              ? "Saving..."
              : editingPortfolio
              ? "Save Changes"
              : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}