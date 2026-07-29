import { useState, useEffect, useCallback } from "react";
import { portfolioService } from "@/features/portfolio/services/portfolio.service";
import type { Portfolio } from "@/features/portfolio/types/portfolio.types";

interface UsePortfoliosOptions {
  selectedPortfolioId: string | null;
  onSelectPortfolio: (id: string) => void;
}

export function usePortfolios({ selectedPortfolioId, onSelectPortfolio }: UsePortfoliosOptions) {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPortfolios = useCallback(async () => {
    try {
      setLoading(true);
      const data = await portfolioService.getAll();
      setPortfolios(data);
      if (data.length > 0 && !selectedPortfolioId) {
        onSelectPortfolio(data[0].id);
      }
    } catch (error) {
      console.error("Error loading portfolios:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedPortfolioId, onSelectPortfolio]);

  useEffect(() => {
    loadPortfolios();
  }, []);

  async function createPortfolio(title: string) {
    const newPortfolio = await portfolioService.create({ title });
    onSelectPortfolio(newPortfolio.id);
    await loadPortfolios();
  }

  async function renamePortfolio(portfolio: Portfolio, title: string) {
    await portfolioService.update(portfolio.id, { title, status: portfolio.status });
    await loadPortfolios();
  }

  async function deletePortfolio(id: string) {
    if (portfolios.length <= 1) {
      alert("You must keep at least one portfolio.");
      return;
    }
    if (!confirm("Are you sure you want to delete this portfolio?")) return;

    await portfolioService.delete(id);

    if (selectedPortfolioId === id) {
      const remaining = portfolios.filter((p) => p.id !== id);
      if (remaining.length > 0) onSelectPortfolio(remaining[0].id);
    }

    await loadPortfolios();
  }

  return { portfolios, loading, createPortfolio, renamePortfolio, deletePortfolio };
}