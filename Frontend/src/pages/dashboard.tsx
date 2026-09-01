import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/features/dashboard/components/DashboardSidebar";
import { FinancialCanvas } from "../features/canvas/components/FinancialCanvas";

export function Dashboard() {
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<string | null>(null);

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden">
        <DashboardSidebar 
          selectedPortfolioId={selectedPortfolioId}
          onSelectPortfolio={setSelectedPortfolioId}
        />

        <main className="flex flex-1 flex-col overflow-hidden">
          <div className="flex items-center border-b px-4 py-2 bg-background justify-between">
            <SidebarTrigger />

          </div>

          <div className="flex-1 overflow-hidden relative">
            <FinancialCanvas portfolioId={selectedPortfolioId} />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}