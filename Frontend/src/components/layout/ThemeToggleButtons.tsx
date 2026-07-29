import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggleButtons() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex gap-2">
      <Button
        variant={theme === "light" ? "default" : "outline"}
        className="flex-1 gap-2 text-sm justify-center"
        onClick={() => setTheme("light")}
      >
        <Sun className="h-4 w-4" /> Claro
      </Button>
      <Button
        variant={theme === "dark" ? "default" : "outline"}
        className="flex-1 gap-2 text-sm justify-center"
        onClick={() => setTheme("dark")}
      >
        <Moon className="h-4 w-4" /> Oscuro
      </Button>
    </div>
  );
}