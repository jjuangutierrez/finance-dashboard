import { useState } from "react";
import authService from "../services/auth.service";
import { useAuth } from "../context/AuthContext";

export function useGoogleAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();

  const loginWithGoogle = async (idToken: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const result = await authService.loginWithGoogle(idToken);
      if (result.success && result.token) {
        login(result.token);
        return true;
      } else {
        setError(result.errors?.[0] || "We were unable to authenticate with Google.");
        return false;
      }
    } catch (err) {
      setError("Connection error while authenticating with Google.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { loginWithGoogle, loading, error };
}