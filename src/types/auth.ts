// src/types/auth.ts
export interface LoginForm {
  username: string;
  password: string;
}

// useAuth에서 사용하는 LoginCredentials 추가
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginOptions {
  rememberLogin: boolean;
  saveId: boolean;
}

export type OAuthProvider = 'naver' | 'kakao' | 'google';

export interface UserDto {
  id: number,
  username: string;
  email: string;
  role: string;
  name?: string;
}

export interface RegisterData {
  username: string;
  password: string;
  email: string;
  name: string;
}

export interface AuthResult {
  success: boolean;
  error?: string;
}

export interface AuthState {
  user: UserDto | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}