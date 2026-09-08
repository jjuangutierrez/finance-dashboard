import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { NavLinks } from "./NavLinks";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { LanguageSwitcherButtons } from "./LanguageSwitcherButtons";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <header className="w-full py-5 px-6 md:px-12 flex justify-between items-center border-b border-border">
      <div className="flex items-center gap-2">
        <span className="font-extrabold text-2xl tracking-tight text-primary">
          My App
        </span>
      </div>

      <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
        <NavLinks />
        <div className="flex items-center gap-2 border-l pl-4 border-border">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </nav>

      <div className="flex md:hidden items-center gap-2">
        <Sheet>
          <SheetTrigger>
            <Button variant="outline" size="icon" aria-label="Abrir menú">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px]">
            <SheetHeader>
              <SheetTitle className="text-left font-extrabold text-xl text-primary mb-6">
                My App
              </SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-6 text-base font-medium">
              <NavLinks />
              <div className="flex flex-col gap-6 pt-6 border-t border-border">
                <div className="flex flex-col gap-2">
                  <span className="text-xs text-muted-foreground font-semibold px-1">
                    Idioma / Language
                  </span>
                  <LanguageSwitcherButtons />
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-xs text-muted-foreground font-semibold px-1">
                    Tema / Appearance
                  </span>
                  <ThemeToggle />
                </div>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}