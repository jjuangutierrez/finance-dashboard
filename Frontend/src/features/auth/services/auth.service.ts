import api from "@/lib/api";
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

const TOKEN_KEY = "token";

class AuthService {
  async register(request: RegisterRequest): Promise<AuthResult> {
    return this.handleAuthRequest("/auth/register", request);
  }

  async login(request: LoginRequest): Promise<AuthResult> {
    return this.handleAuthRequest("/auth/login", request);
  }

  async loginWithGoogle(idToken: string): Promise<AuthResult> {
    return this.handleAuthRequest("/auth/google", { idToken });
  }

  logout() {
    localStorage.removeItem(TOKEN_KEY);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  saveToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  private async handleAuthRequest(
    url: string,
    payload: unknown
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