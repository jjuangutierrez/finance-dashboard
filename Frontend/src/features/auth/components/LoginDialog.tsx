import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Eye, EyeOff, Wallet } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useLogin } from "@/features/auth/hooks/useLogin";
import { useGoogleAuth } from "../hooks/useGoogleAuth";
import { useNavigate } from "react-router-dom";

export function LoginDialog() {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const { login, loading, error } = useLogin();
  const { loginWithGoogle, loading: googleLoading, error: googleError } =
    useGoogleAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const success = await login({
      email: form.email,
      password: form.password,
    });

    if (success) {
      setOpen(false);
      navigate("/dashboard")
    }
  };

  const handleGoogleSuccess = async (credential: string) => {
    const success = await loginWithGoogle(credential);
    if (success) {
      setOpen(false);
      navigate("/dashboard")
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant="outline"
            size="lg"
            className="h-12 sm:h-14 px-8 sm:px-10 text-base sm:text-lg rounded-full"
          >
            {t("home.hero.cta_login")}
          </Button>
        }
      />

      <DialogContent className="sm:max-w-[440px] p-0 rounded-[32px] overflow-hidden gap-0 max-h-[92vh] flex flex-col">
        <div className="overflow-y-auto p-8 flex-1 flex flex-col items-center">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center mb-3 text-primary-foreground">
            <Wallet className="h-5 w-5" />
          </div>

          <DialogHeader className="text-center items-center mb-6">
            <DialogTitle className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {t("home.login.title")}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground font-medium mt-1">
              {t("home.login.subtitle")}
            </DialogDescription>
          </DialogHeader>

          <form className="w-full space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <Label
                htmlFor="email"
                className="text-xs font-semibold text-muted-foreground ml-1"
              >
                {t("home.login.emailLabel")}
              </Label>
              <Input
                id="email"
                type="email"
                placeholder={t("home.login.emailPlaceholder")}
                className="rounded-xl h-11"
                maxLength={150}
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center px-1">
                <Label
                  htmlFor="password"
                  className="text-xs font-semibold text-muted-foreground"
                >
                  {t("home.login.password")}
                </Label>
                <a
                  href="#"
                  className="text-xs text-primary hover:underline font-semibold"
                >
                  {t("home.login.forgotPassword")}
                </a>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={t("home.login.passwordPlaceholder")}
                  className="rounded-xl h-11 pr-10"
                  minLength={8}
                  maxLength={72}
                  value={form.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-xs text-destructive font-medium text-center">
                {error}
              </p>
            )}

            <Button
              type="submit"
              className="w-full h-11 rounded-full text-base mt-2"
              disabled={loading}
            >
              {loading ? t("home.login.loading") : t("home.login.continue")}
            </Button>
          </form>

          <div className="relative w-full flex py-4 items-center justify-center">
            <div className="absolute inset-x-0 border-t border-border"></div>
            <span className="relative bg-popover px-3 text-[11px] font-extrabold text-foreground tracking-wider">
              {t("home.login.or")}
            </span>
          </div>

          <div className="w-full flex flex-col items-center gap-2">
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                if (credentialResponse.credential) {
                  handleGoogleSuccess(credentialResponse.credential);
                }
              }}
              onError={() => {
                console.error("Google login failed");
              }}
              theme="outline"
              shape="pill"
              width="100%"
            />
            {googleLoading && (
              <p className="text-xs text-muted-foreground">
                {t("home.login.loading")}
              </p>
            )}
            {googleError && (
              <p className="text-xs text-destructive font-medium text-center">
                {googleError}
              </p>
            )}
          </div>

          <p className="text-sm mt-6 text-foreground font-medium">
            {t("home.login.noAccount")}{" "}
            <a href="#" className="font-bold hover:underline">
              {t("home.login.signup")}
            </a>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}