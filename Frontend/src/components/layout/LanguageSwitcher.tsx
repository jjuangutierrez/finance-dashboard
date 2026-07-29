import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="ghost" size="icon" aria-label="Cambiar idioma">
          {i18n.language === "es" ? (
            <span className="text-lg">🇪🇸</span>
          ) : (
            <span className="text-lg">🇺🇸</span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[120px]">
        <DropdownMenuItem onClick={() => i18n.changeLanguage("es")} className="cursor-pointer gap-2">
          <span className="text-base">🇪🇸</span> Español
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => i18n.changeLanguage("en")} className="cursor-pointer gap-2">
          <span className="text-base">🇺🇸</span> English
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}