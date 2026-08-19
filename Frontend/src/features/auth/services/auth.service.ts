import api from "@/lib/api";
import { tokenStorage } from "@/lib/tokenStorage";
import { AxiosError } from "axios";

export interface RegisterRequest {
  firstName: string;
  lastName?: string;
  userName: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface GoogleLoginRequest {
  idToken: string;
}

export interface AuthResult {
  success: boolean;
  token: string;
  refreshToken: string;
  errors: string[];
}

class AuthService {
  async register(request: RegisterRequest): Promise<AuthResult> {
    const result = await this.handleAuthRequest("/auth/register", request);
    if (result.success && result.token && result.refreshToken) {
      tokenStorage.setTokens(result.token, result.refreshToken);
    }
    return result;
  }

  async login(request: LoginRequest): Promise<AuthResult> {
    const result = await this.handleAuthRequest("/auth/login", request);
    if (result.success && result.token && result.refreshToken) {
      tokenStorage.setTokens(result.token, result.refreshToken);
    }
    return result;
  }

  async loginWithGoogle(idToken: string): Promise<AuthResult> {
    const result = await this.handleAuthRequest("/auth/google", { idToken });
    if (result.success && result.token && result.refreshToken) {
      tokenStorage.setTokens(result.token, result.refreshToken);
    }
    return result;
  }

  async logout(): Promise<void> {
    try {
      const refreshToken = tokenStorage.getRefreshToken();

      if (refreshToken) {
        await api.post("/auth/logout", { refreshToken });
      }
    } catch (error) {
      console.error("Error al revocar token en el backend:", error);
    } finally {
      tokenStorage.clearTokens();
    }
  }

  saveToken(token: string, refreshToken?: string): void {
    if (refreshToken) {
      tokenStorage.setTokens(token, refreshToken);
    } else {
      const currentRefresh = tokenStorage.getRefreshToken() || "";
      tokenStorage.setTokens(token, currentRefresh);
    }
  }

  getToken(): string | null {
    return tokenStorage.getAccessToken();
  }

  isAuthenticated(): boolean {
    return tokenStorage.hasTokens();
  }

  private async handleAuthRequest(
    url: string,
    payload: unknown,
  ): Promise<AuthResult> {
    try {
      const { data } = await api.post<AuthResult>(url, payload);
      return data;
    } catch (err) {
      const axiosError = err as AxiosError<AuthResult>;

      if (axiosError.response?.data) {
        return axiosError.response.data;
      }

      return {
        success: false,
        token: "",
        refreshToken: "",
        errors: ["We were unable to connect to the server. Please try again."],
      };
    }
  }
}

export default new AuthService();
