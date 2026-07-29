import { Plus } from "lucide-react";
import type { WidgetOption } from "../types/widget.types";

interface WidgetPaletteItemProps {
  option: WidgetOption;
  onSelect: (kind: WidgetOption["kind"]) => void;
}

export function WidgetPaletteItem({ option, onSelect }: WidgetPaletteItemProps) {
  const Icon = option.icon;
  
  return (
    <button
      onClick={() => onSelect(option.kind)}
      className="
        group relative flex flex-col items-center p-3 rounded-xl border border-transparent 
        bg-muted/40 hover:bg-accent hover:border-border transition-all duration-200 
        w-28 text-center cursor-pointer hover:scale-105 active:scale-95
      "
    >
      <Icon className="h-6 w-6 mb-1 text-foreground group-hover:scale-110 transition-transform" />

      <span className="text-xs font-medium text-foreground truncate w-full">
        {option.title}
      </span>

      <span className="text-[10px] text-muted-foreground truncate w-full mt-0.5">
        {option.description}
      </span>

      <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-primary text-primary-foreground rounded-full p-0.5">
        <Plus className="h-3 w-3" />
      </div>
    </button>
  );
}