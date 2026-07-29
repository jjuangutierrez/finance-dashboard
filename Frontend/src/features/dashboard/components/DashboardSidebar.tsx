import { useState } from "react";
import { Wallet } from "lucide-react";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

import { usePortfolios } from "../hooks/usePortfolios";
import { PortfolioList } from "./PortfolioList";
import { PortfolioDialog } from "./PortfolioDialog";
import { AccountMenu } from "./AccountMenu";
import type { DashboardSidebarProps } from "../interfaces/DashboardSidebarProps";
import type { Portfolio } from "@/features/portfolio/types/portfolio.types";

export function DashboardSidebar({ selectedPortfolioId, onSelectPortfolio }: DashboardSidebarProps) {
  const { portfolios, loading, createPortfolio, renamePortfolio, deletePortfolio } = usePortfolios({
    selectedPortfolioId,
    onSelectPortfolio,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPortfolio, setEditingPortfolio] = useState<Portfolio | null>(null);

  function handleOpenCreateModal() {
    setEditingPortfolio(null);
    setIsModalOpen(true);
  }

  function handleOpenRenameModal(portfolio: Portfolio) {
    setEditingPortfolio(portfolio);
    setIsModalOpen(true);
  }

  async function handleSave(title: string) {
    if (editingPortfolio) {
      await renamePortfolio(editingPortfolio, title);
    } else {
      await createPortfolio(title);
    }
    setIsModalOpen(false);
  }

  return (
    <>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Wallet className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Finance Dashboard</span>
                  <span className="truncate text-xs text-muted-foreground">Personal</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent className="p-2">
          <PortfolioList
            portfolios={portfolios}
            loading={loading}
            selectedPortfolioId={selectedPortfolioId}
            onSelectPortfolio={onSelectPortfolio}
            onCreate={handleOpenCreateModal}
            onRename={handleOpenRenameModal}
            onDelete={deletePortfolio}
          />
        </SidebarContent>

        <AccountMenu />
      </Sidebar>

      <PortfolioDialog
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        editingPortfolio={editingPortfolio}
        onSave={handleSave}
      />
    </>
  );
}