import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

export function LanguageSwitcherButtons() {
  const { i18n } = useTranslation();

  return (
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
  );
}