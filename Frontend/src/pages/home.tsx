import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  LayoutDashboard,
  TrendingUp,
  Target,
  CalendarClock,
  Sparkles,
} from "lucide-react";

import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { RegisterDialog } from "../features/auth/components/RegisterDialog";
import { LoginDialog } from "../features/auth/components/LoginDialog";
import { useAuth } from "@/features/auth/context/AuthContext";

import trackerImg from "@/assets/TrackerWidget.png";
import savingGoalImg from "@/assets/SavingGoalWidget.png";
import recurringExpensesImg from "@/assets/RecurringExpenses.png";

export function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const features = [
    {
      title: t("home.features.tracker.title", "Expense & Income Tracker"),
      description: t(
        "home.features.tracker.description",
        "Organiza tus ingresos y gastos en tiempo real. Visualiza tu flujo de dinero mediante gráficos interactivos y toma el control de tus finanzas."
      ),
      image: trackerImg,
      icon: TrendingUp,
      iconClass: "text-emerald-600 bg-emerald-500/10",
    },
    {
      title: t("home.features.savings.title", "Savings Goals"),
      description: t(
        "home.features.savings.description",
        "Define metas de ahorro claras, programa depósitos y monitorea el progreso hacia tus objetivos con barras visuales de cumplimiento."
      ),
      image: savingGoalImg,
      icon: Target,
      iconClass: "text-sky-600 bg-sky-500/10",
    },
    {
      title: t("home.features.recurring.title", "Recurring Expenses & Bills"),
      description: t(
        "home.features.recurring.description",
        "Mantén todas tus suscripciones y facturas fijas mensuales organizadas. Evita cobros sorpresa y calcula tu compromiso recurrente."
      ),
      image: recurringExpensesImg,
      icon: CalendarClock,
      iconClass: "text-amber-600 bg-amber-500/10",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-heading flex flex-col justify-between selection:bg-primary/20 selection:text-primary">
      <Header />

      {/* 1. HERO CENTRADO */}
      <section className="relative pt-16 pb-24 md:pt-28 md:pb-36 overflow-hidden">
        {/* Resplandor sutil de fondo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-primary/10 blur-[130px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-4xl mx-auto px-6 flex flex-col items-center text-center gap-7">
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-card/60 backdrop-blur text-xs font-medium text-muted-foreground shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>{t("home.hero.pill", "Tu lienzo financiero")}</span>
          </div>

          {/* Titular Principal */}
          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-[5rem] leading-[1.06] tracking-tight text-balance">
            {t("home.hero.title", "Ordena tu dinero con")}{" "}
            <span className="text-primary block sm:inline">
              {t("home.hero.subtitle", "total claridad")}
            </span>
          </h1>

          {/* Descripción */}
          <p className="text-base sm:text-xl text-muted-foreground max-w-2xl leading-relaxed font-normal">
            {t(
              "home.hero.description",
              "Unifica tus cuentas, rastrea gastos, proyecta ahorros y gestiona tus suscripciones desde un lienzo financiero interactivo y personalizable."
            )}
          </p>

          {/* Botones de Acción */}
          <div className="flex flex-col sm:flex-row gap-4 mt-3 justify-center items-center">
            {isAuthenticated ? (
              <Button
                size="lg"
                className="h-13 px-9 text-base rounded-full gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all font-medium"
                onClick={() => navigate("/dashboard")}
              >
                <LayoutDashboard className="h-5 w-5" />
                <span>{t("home.hero.cta_dashboard", "Ir a mi Dashboard")}</span>
                <ArrowRight className="h-5 w-5" />
              </Button>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3 items-center">
                <RegisterDialog />
                <LoginDialog />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2. WIDGETS (Alternando en Zigzag) */}
      <section className="py-16 md:py-24 border-t border-border bg-muted/10">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="font-serif text-3xl sm:text-4xl tracking-tight max-w-lg mb-16">
            {t("home.features.section_title", "Todo lo que necesitas para organizar tu dinero")}
          </h2>

          <div className="flex flex-col">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              const reversed = idx % 2 === 1;
              return (
                <div
                  key={idx}
                  className={`flex flex-col ${
                    reversed ? "md:flex-row-reverse" : "md:flex-row"
                  } gap-8 md:gap-14 items-center py-12 ${
                    idx !== 0 ? "border-t border-border" : ""
                  }`}
                >
                  <div className="flex-1 rounded-2xl overflow-hidden border border-border shadow-sm bg-card p-2 group hover:shadow-md transition-shadow">
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-auto rounded-xl object-contain"
                    />
                  </div>

                  <div className="flex-1 space-y-3 max-w-md">
                    <span
                      className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${feature.iconClass}`}
                    >
                      <Icon className="w-4 h-4" />
                    </span>
                    <h3 className="font-serif text-2xl tracking-tight text-card-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. CTA FINAL */}
      <section className="py-20 md:py-28 border-t border-border">
        <div className="max-w-2xl mx-auto px-6 text-center space-y-6">
          <h2 className="font-serif text-3xl sm:text-4xl tracking-tight text-balance">
            {t("home.cta.title", "¿Listo para tomar el control de tus finanzas?")}
          </h2>
          <p className="text-muted-foreground text-base leading-relaxed">
            {t(
              "home.cta.subtitle",
              "Comienza a construir tu lienzo financiero hoy mismo y toma decisiones informadas."
            )}
          </p>

          <div className="pt-2 flex justify-center">
            {isAuthenticated ? (
              <Button
                size="lg"
                className="h-12 px-8 rounded-full font-medium gap-2 shadow-md shadow-primary/20"
                onClick={() => navigate("/dashboard")}
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>{t("home.cta.dashboard", "Ir a mi Dashboard")}</span>
              </Button>
            ) : (
              <RegisterDialog />
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 text-center text-xs text-muted-foreground border-t border-border px-6">
        {t("home.footer", { year: new Date().getFullYear() })}
      </footer>
    </div>
  );
}