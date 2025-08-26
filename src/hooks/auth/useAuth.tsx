// src/hooks/auth/useAuth.tsx
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import type { UserDto, LoginCredentials, RegisterData, AuthResult, AuthState } from '../../types/auth';
import React from 'react';

export const useAuth = () => {
  const navigate = useNavigate();
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  // 토큰 확인 및 사용자 정보 가져오기
  const checkAuth = useCallback(async (): Promise<boolean> => {
    const token = localStorage.getItem('accessToken');
    
    if (!token) {
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
      return false;
    }

    try {
      const response = await axios.get<UserDto>('/users/me');
      setAuthState({
        user: response.data,
        isLoading: false,
        isAuthenticated: true,
      });
      return true;
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('accessToken');
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
      return false;
    }
  }, []);

  // 로그인
  const login = useCallback(async (credentials: LoginCredentials): Promise<AuthResult> => {
    try {
      const response = await axios.post('/auth/login', credentials);
      const { accessToken } = response.data;
      
      localStorage.setItem('accessToken', accessToken);
      
      // 사용자 정보 다시 가져오기
      await checkAuth();
      
      return { success: true };
    } catch (error: any) {
      console.error('Login failed:', error);
      return {
        success: false,
        error: error.response?.data?.message || '로그인에 실패했습니다.',
      };
    }
  }, [checkAuth]);

  // 로그아웃
  const logout = useCallback(async (): Promise<void> => {
    try {
      // 서버에 로그아웃 요청
      await axios.post('/logout', {}, { withCredentials: true });
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      // 로컬 상태 초기화
      localStorage.removeItem('accessToken');
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  }, []);

  // 회원가입
  const register = useCallback(async (userData: RegisterData): Promise<AuthResult> => {
    try {
      await axios.post('/users', userData);
      return { success: true };
    } catch (error: any) {
      console.error('Registration failed:', error);
      return {
        success: false,
        error: error.response?.data?.message || '회원가입에 실패했습니다.',
      };
    }
  }, []);

  // 인증이 필요한 페이지에서 사용하는 함수
  const requireAuth = useCallback((redirectTo: string = '/'): boolean => {
    if (!authState.isLoading && !authState.isAuthenticated) {
      navigate(redirectTo);
      return false;
    }
    return authState.isAuthenticated;
  }, [authState.isAuthenticated, authState.isLoading, navigate]);

  // 컴포넌트 마운트 시 인증 상태 확인
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return {
    // 상태
    user: authState.user,
    isLoading: authState.isLoading,
    isAuthenticated: authState.isAuthenticated,
    
    // 메소드
    login,
    logout,
    register,
    checkAuth,
    requireAuth,
  };
};

// 인증된 사용자만 접근할 수 있는 페이지용 훅
export const useRequireAuth = (redirectTo: string = '/') => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate(redirectTo);
    }
  }, [isAuthenticated, isLoading, redirectTo, navigate]);

  return isAuthenticated;
};

// 인증된 사용자만 접근 가능한 페이지에서 사용하는 HOC
export const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  redirectTo: string = '/'
) => {
  const AuthenticatedComponent = (props: P) => {
    const { isAuthenticated, isLoading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        navigate(redirectTo);
      }
    }, [isAuthenticated, isLoading, navigate, redirectTo]);

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">인증 확인 중...</p>
          </div>
        </div>
      );
    }

    if (!isAuthenticated) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  AuthenticatedComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name})`;

  return AuthenticatedComponent;
};