import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Menu, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { RegisterDialog } from "../features/auth/components/RegisterDialog";
import { LoginDialog } from "../features/auth/components/LoginDialog";

export function Home() {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  if (!mounted) {
    return null;
  }

  const NavLinks = () => (
    <>
      <a
        href="https://github.com"
        target="_blank"
        rel="noopener noreferrer"
        className="text-muted-foreground hover:text-foreground transition-colors"
      >
        {t("home.nav.github")}
      </a>
      <a
        href="https://linkedin.com"
        target="_blank"
        rel="noopener noreferrer"
        className="text-muted-foreground hover:text-foreground transition-colors"
      >
        {t("home.nav.linkedin")}
      </a>
      <a
        href="#about"
        className="text-muted-foreground hover:text-foreground transition-colors"
      >
        {t("home.nav.about")}
      </a>
    </>
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      <header className="w-full py-5 px-6 md:px-12 flex justify-between items-center border-b border-border">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-2xl tracking-tight text-primary">
            My App
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <NavLinks />
          <div className="flex items-center gap-2 border-l pl-4 border-border">
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
                <DropdownMenuItem
                  onClick={() => i18n.changeLanguage("es")}
                  className="cursor-pointer gap-2"
                >
                  <span className="text-base">🇪🇸</span> Español
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => i18n.changeLanguage("en")}
                  className="cursor-pointer gap-2"
                >
                  <span className="text-base">🇺🇸</span> English
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Cambiar tema"
            >
              {theme === "dark" ? (
                <Sun className="h-[1.2rem] w-[1.2rem]" />
              ) : (
                <Moon className="h-[1.2rem] w-[1.2rem]" />
              )}
            </Button>
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
                    <div className="flex gap-2">
                      <Button
                        variant={i18n.language === "es" ? "default" : "outline"}
                        className="flex-1 gap-2 text-sm justify-center"
                        onClick={() => i18n.changeLanguage("es")}
                      >
                        <span>🇪🇸</span> Español
                      </Button>
                      <Button
                        variant={i18n.language === "en" ? "default" : "outline"}
                        className="flex-1 gap-2 text-sm justify-center"
                        onClick={() => i18n.changeLanguage("en")}
                      >
                        <span>🇺🇸</span> English
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <span className="text-xs text-muted-foreground font-semibold px-1">
                      Tema / Appearance
                    </span>
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
                  </div>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-12 md:py-20 flex flex-col items-center justify-center text-center gap-8">
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.1] text-balance">
          {t("home.hero.title")}{" "}
          <span className="text-primary block sm:inline">
            {t("home.hero.subtitle")}
          </span>
        </h1>

        <p className="text-base sm:text-xl text-muted-foreground max-w-2xl font-medium leading-relaxed">
          {t("home.hero.description")}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-4 justify-center">
          <RegisterDialog />
          <LoginDialog />
        </div>
      </main>

      <footer className="py-8 text-center text-xs text-muted-foreground border-t border-border px-6">
        {t("home.footer", { year: new Date().getFullYear() })}
      </footer>
    </div>
  );
}