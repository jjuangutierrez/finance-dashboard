import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ArrowRight, LayoutDashboard } from "lucide-react";

import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { RegisterDialog } from "../features/auth/components/RegisterDialog";
import { LoginDialog } from "../features/auth/components/LoginDialog";
import { useAuth } from "@/features/auth/context/AuthContext";

export function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      <Header />

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
          {isAuthenticated ? (
            <Button
              size="lg"
              className="h-12 sm:h-14 px-8 sm:px-10 text-base sm:text-lg rounded-full gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
              onClick={() => navigate("/dashboard")}
            >
              <LayoutDashboard className="h-5 w-5" />
              <span>{t("home.hero.cta_dashboard", "Go to Dashboard")}</span>
              <ArrowRight className="h-5 w-5 ml-1" />
            </Button>
          ) : (
            <>
              <RegisterDialog />
              <LoginDialog />
            </>
          )}
        </div>
      </main>

      <footer className="py-8 text-center text-xs text-muted-foreground border-t border-border px-6">
        {t("home.footer", { year: new Date().getFullYear() })}
      </footer>
    </div>
  );
}