import { useState } from "react";
import authService from "../../auth/services/auth.service";
import { useAuth } from "@/features/auth/context/AuthContext";
import type { LoginRequest } from "../../auth/types/auth.types";

export function useLogin() {
  const { login: setSession } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (data: LoginRequest): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const result = await authService.login(data);

      if (!result.success || !result.token) {
        setError(result.errors?.[0] ?? "Invalid credentials.");
        return false;
      }

      setSession(result.token);
      return true;
    } catch {
      setError("Server connection error.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
}