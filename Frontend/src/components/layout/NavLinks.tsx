import { useTranslation } from "react-i18next";

export function NavLinks() {
  const { t } = useTranslation();
  return (
    <>
      <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
        {t("home.nav.github")}
      </a>
      <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
        {t("home.nav.linkedin")}
      </a>
      <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">
        {t("home.nav.about")}
      </a>
    </>
  );
}