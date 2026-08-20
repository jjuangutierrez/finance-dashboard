import { BarChart3, Target, Repeat } from "lucide-react";
import type { WidgetOption } from "../types/widget.types";

export const WIDGET_OPTIONS: WidgetOption[] = [
  {
    kind: "tracker",
    title: "Tracker",
    icon: BarChart3,
    description: "Ingresos y Gastos",
  },
  {
    kind: "savinggoal",
    title: "Saving Goal",
    icon: Target,
    description: "Meta de Ahorro",
  },
  {
    kind: "recurring_expense",
    title: "Recurring Expense",
    icon: Repeat,
    description: "Suscripciones y Pagos",
  },
];