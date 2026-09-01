import { useState, useEffect, useCallback, useRef } from "react";
import { portfolioService } from "@/features/portfolios/services/portfolio.service";
import type { Portfolio } from "@/features/portfolios/types/portfolio.types";

interface UsePortfoliosOptions {
  selectedPortfolioId: string | null;
  onSelectPortfolio: (id: string) => void;
}

export function usePortfolios({ selectedPortfolioId, onSelectPortfolio }: UsePortfoliosOptions) {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedPortfolioIdRef = useRef(selectedPortfolioId);
  selectedPortfolioIdRef.current = selectedPortfolioId;

  const onSelectPortfolioRef = useRef(onSelectPortfolio);
  onSelectPortfolioRef.current = onSelectPortfolio;

  const loadPortfolios = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await portfolioService.getAll();
      setPortfolios(data);

      if (data.length > 0 && !selectedPortfolioIdRef.current) {
        onSelectPortfolioRef.current(data[0].id);
      }
    } catch (err) {
      console.error("Error loading portfolios:", err);
      setError("No se pudieron cargar los portafolios");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPortfolios();
  }, [loadPortfolios]);

  async function createPortfolio(title: string) {
    try {
      setIsSaving(true);
      const newPortfolio = await portfolioService.create({ title });
      onSelectPortfolioRef.current(newPortfolio.id);
      await loadPortfolios();
      return true;
    } catch (err) {
      console.error("Error creating portfolio:", err);
      return false;
    } finally {
      setIsSaving(false);
    }
  }

  async function renamePortfolio(portfolio: Portfolio, title: string) {
    try {
      setIsSaving(true);
      await portfolioService.update(portfolio.id, { title, status: portfolio.status });
      await loadPortfolios();
      return true;
    } catch (err) {
      console.error("Error renaming portfolio:", err);
      return false;
    } finally {
      setIsSaving(false);
    }
  }

  async function deletePortfolio(id: string) {
    if (portfolios.length <= 1) {
      return false;
    }

    try {
      setIsSaving(true);
      await portfolioService.delete(id);

      if (selectedPortfolioIdRef.current === id) {
        const remaining = portfolios.filter((p) => p.id !== id);
        if (remaining.length > 0) {
          onSelectPortfolioRef.current(remaining[0].id);
        }
      }

      await loadPortfolios();
      return true;
    } catch (err) {
      console.error("Error deleting portfolio:", err);
      return false;
    } finally {
      setIsSaving(false);
    }
  }

  return { 
    portfolios, 
    loading, 
    isSaving,
    error,
    createPortfolio, 
    renamePortfolio, 
    deletePortfolio,
    refetch: loadPortfolios 
  };
}