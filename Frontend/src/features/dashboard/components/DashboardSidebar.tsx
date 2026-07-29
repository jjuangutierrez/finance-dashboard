import { useState, useEffect } from "react";
import { 
  User, 
  LogOut, 
  UserCheck, 
  Wallet, 
  Plus, 
  MoreHorizontal, 
  Pencil, 
  Trash2, 
  Folder 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import authService from "@/features/auth/services/auth.service";
import { portfolioService } from "@/features/portfolio/services/portfolio.service";
import type { Portfolio } from "@/features/portfolio/types/portfolio.types";

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
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

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { DashboardSidebarProps } from "../interfaces/DashboardSidebarProps";


export function DashboardSidebar({ selectedPortfolioId, onSelectPortfolio }: DashboardSidebarProps) {
  const navigate = useNavigate();

  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [activePortfolioId, setActivePortfolioId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPortfolio, setEditingPortfolio] = useState<Portfolio | null>(null);
  const [titleInput, setTitleInput] = useState("");

  useEffect(() => {
    loadPortfolios();
  }, []);

  async function loadPortfolios() {
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
  }

  function handleOpenCreateModal() {
    setEditingPortfolio(null);
    setTitleInput("");
    setIsModalOpen(true);
  }

  function handleOpenRenameModal(portfolio: Portfolio) {
    setEditingPortfolio(portfolio);
    setTitleInput(portfolio.title);
    setIsModalOpen(true);
  }

  async function handleSavePortfolio() {
    if (!titleInput.trim()) return;

    try {
      if (editingPortfolio) {
        await portfolioService.update(editingPortfolio.id, {
          title: titleInput,
          status: editingPortfolio.status,
        });
      } else {
        const newPortfolio = await portfolioService.create({ title: titleInput });
        setActivePortfolioId(newPortfolio.id);
      }
      
      setIsModalOpen(false);
      await loadPortfolios(); 
    } catch (error) {
      console.error("Error saving portfolio:", error);
    }
  }

  async function handleDeletePortfolio(id: string) {
    if (portfolios.length <= 1) {
      alert("You must keep at least one portfolio.");
      return;
    }

    if (!confirm("Are you sure you want to delete this portfolio?")) return;

    try {
      await portfolioService.delete(id);
      
      if (activePortfolioId === id) {
        const remaining = portfolios.filter((p) => p.id !== id);
        if (remaining.length > 0) setActivePortfolioId(remaining[0].id);
      }

      await loadPortfolios();
    } catch (error) {
      console.error("Error deleting portfolio:", error);
    }
  }

  function handleLogout() {
    authService.logout();
    navigate("/");
  }

  function handleProfile() {
    navigate("/profile");
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
          <SidebarGroup>
            <SidebarGroupLabel>Portfolios</SidebarGroupLabel>
            
            <SidebarGroupAction title="New Portfolio" onClick={handleOpenCreateModal}>
              <Plus className="h-4 w-4" />
              <span className="sr-only">Add Portfolio</span>
            </SidebarGroupAction>

            <SidebarMenu>
              {loading ? (
                <div className="px-2 py-1 text-xs text-muted-foreground">Loading...</div>
              ) : (
                portfolios.map((portfolio) => {
                  const isActive = portfolio.id === activePortfolioId;

                  return (
                    <SidebarMenuItem key={portfolio.id}>
                      <SidebarMenuButton
                        isActive={isActive}
                        onClick={() => setActivePortfolioId(portfolio.id)}
                        className="cursor-pointer"
                      >
                        <Folder className="h-4 w-4" />
                        <span className="truncate">{portfolio.title}</span>
                      </SidebarMenuButton>

                      <DropdownMenu>
                        <DropdownMenuTrigger >
                          <SidebarMenuAction showOnHover>
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">More</span>
                          </SidebarMenuAction>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" side="right" className="w-40">
                          <DropdownMenuItem
                            onClick={() => handleOpenRenameModal(portfolio)}
                            className="cursor-pointer"
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            <span>Rename</span>
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => handleDeletePortfolio(portfolio.id)}
                            className="cursor-pointer text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </SidebarMenuItem>
                  );
                })
              )}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger >
                  <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent">
                    <div className="flex aspect-square size-8 items-center justify-center rounded-full bg-muted">
                      <User className="size-4" />
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">My Account</span>
                    </div>
                  </SidebarMenuButton>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={handleProfile} className="cursor-pointer">
                    <UserCheck className="mr-2 h-4 w-4" />
                    <span>View Profile</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
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
              onKeyDown={(e) => e.key === "Enter" && handleSavePortfolio()}
              autoFocus
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSavePortfolio}>
              {editingPortfolio ? "Save Changes" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}