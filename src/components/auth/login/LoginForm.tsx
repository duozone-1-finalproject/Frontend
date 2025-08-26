// components/auth/LoginForm.tsx
import React from 'react';
import { Button, Card } from '../../common';
import { LoginInputs } from './LoginInput';
import { LoginOptions } from './LoginOptions';
import { SocialLogin } from '../oauth/SocialLogin';

type OAuthProvider = 'naver' | 'kakao' | 'google';

interface LoginFormComponentProps {
  form: { username: string; password: string };
  error: string;
  loading: boolean;
  rememberMe: boolean;
  saveId: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLogin: (e: React.FormEvent) => void;
  onOAuthLogin: (provider: OAuthProvider) => void;
  onRegisterClick: () => void;
  onRememberMeChange: (checked: boolean) => void;
  onSaveIdChange: (checked: boolean) => void;
}

export const LoginFormComponent: React.FC<LoginFormComponentProps> = ({
  form,
  error,
  loading,
  rememberMe,
  saveId,
  onInputChange,
  onLogin,
  onOAuthLogin,
  onRegisterClick,
  onRememberMeChange,
  onSaveIdChange
}) => {
  return (
    <Card className="w-full max-w-md">
      <div className="text-center text-lg font-bold text-blue-600 border-b border-gray-200 pb-4 mb-6">
        기업 회원
      </div>

      <form onSubmit={onLogin} className="space-y-4">
        <LoginInputs 
          form={form}
          loading={loading}
          onInputChange={onInputChange}
        />

        <LoginOptions
          rememberMe={rememberMe}
          saveId={saveId}
          loading={loading}
          onRememberMeChange={onRememberMeChange}
          onSaveIdChange={onSaveIdChange}
        />

        {error && (
          <div className="text-sm text-red-500 text-center bg-red-50 border border-red-200 rounded-lg p-3">
            {error}
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          fullWidth
          loading={loading}
          disabled={loading}
        >
          {loading ? '로그인 중...' : '로그인'}
        </Button>

        <button
          type="button"
          onClick={onRegisterClick}
          disabled={loading}
          className="w-full text-center text-sm text-gray-500 hover:text-gray-700 underline cursor-pointer transition-colors disabled:opacity-50"
        >
          회원가입
        </button>
      </form>

      <SocialLogin onOAuthLogin={onOAuthLogin} />

      <div className="text-xs text-center text-gray-400 mt-6 pt-4 border-t border-gray-200">
        Copyright 2025, keommaeng, All rights reserved
      </div>
    </Card>
  );
};