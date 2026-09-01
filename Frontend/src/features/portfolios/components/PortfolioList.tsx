import { MoreHorizontal, Pencil, Trash2, Folder, Plus } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupAction,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Portfolio } from "@/features/portfolios/types/portfolio.types";

interface PortfolioListProps {
  portfolios: Portfolio[];
  loading: boolean;
  selectedPortfolioId: string | null;
  onSelectPortfolio: (id: string) => void;
  onCreate: () => void;
  onRename: (portfolio: Portfolio) => void;
  onDelete: (id: string) => void;
}

export function PortfolioList({
  portfolios,
  loading,
  selectedPortfolioId,
  onSelectPortfolio,
  onCreate,
  onRename,
  onDelete,
}: PortfolioListProps) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Portfolios</SidebarGroupLabel>

      <SidebarGroupAction title="New Portfolio" onClick={onCreate}>
        <Plus className="h-4 w-4" />
        <span className="sr-only">Add Portfolio</span>
      </SidebarGroupAction>

      <SidebarMenu>
        {loading ? (
          <div className="px-2 py-1 text-xs text-muted-foreground">
            Loading...
          </div>
        ) : (
          portfolios.map((portfolio) => (
            <SidebarMenuItem key={portfolio.id}>
              <SidebarMenuButton
                isActive={portfolio.id === selectedPortfolioId}
                onClick={() => onSelectPortfolio(portfolio.id)}
                tooltip={portfolio.title}
                className="cursor-pointer"
              >
                <Folder className="h-4 w-4 shrink-0" />
                <span className="truncate">{portfolio.title}</span>
              </SidebarMenuButton>

              <DropdownMenu>
                <DropdownMenuTrigger className="group-data-[collapsible=icon]:hidden">
                  <SidebarMenuAction showOnHover>
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">More</span>
                  </SidebarMenuAction>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" side="right" className="w-40">
                  <DropdownMenuItem
                    onClick={() => onRename(portfolio)}
                    className="cursor-pointer"
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    <span>Rename</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => onDelete(portfolio.id)}
                    className="cursor-pointer text-red-600 focus:text-red-600"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          ))
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}