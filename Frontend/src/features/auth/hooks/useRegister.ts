import { useState } from "react";
import authService from "../../auth/services/auth.service";
import { useAuth } from "@/features/auth/context/AuthContext";
import type { RegisterRequest } from "../../auth/types/auth.types";

export function useRegister() {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (data: RegisterRequest) => {
    setLoading(true);
    setError(null);
    try {
      const result = await authService.register(data);
      if (!result.success || !result.token) {
        setError(result.errors?.[0] ?? "Registration could not be completed.");
        return false;
      }
      login(result.token);
      return true;
    } catch {
      setError("Server connection error.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { register, loading, error };
}