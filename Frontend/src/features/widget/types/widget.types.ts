import type { LucideIcon } from "lucide-react";

export type WidgetKind = "tracker" | "saving_goal" | "recurring_expense" | "summary";

export interface WidgetOption {
  kind: WidgetKind;
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface Widget {
  id: string;
  portfolioId: string;
  kind: WidgetKind;
  name: string;
  description?: string;
  posX: number;
  posY: number;
  width: number;
  height: number;
  targetAmount?: number;
  targetDate?: string;
}

export interface CreateWidgetRequest {
  kind: WidgetKind;
  name: string;
  description?: string;
  targetAmount?: number;
  targetDate?: string;
}

export interface UpdateWidgetLayoutItem {
  id: string;
  posX: number;
  posY: number;
  width: number;
  height: number;
}

export interface UpdateWidgetRequest {
  name?: string;
  description?: string;
  targetAmount?: number;
  targetDate?: string;
}