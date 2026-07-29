export interface DashboardSidebarProps {
  selectedPortfolioId: string | null;
  onSelectPortfolio: (id: string) => void;
}