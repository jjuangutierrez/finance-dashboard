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