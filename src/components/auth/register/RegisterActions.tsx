// components/auth/RegisterActions.tsx
import React from 'react';
import { Button } from '../../common';

interface FormErrors {
  general?: string;
}

interface RegisterActionsProps {
  errors: FormErrors;
  loading: boolean;
  onLoginClick: () => void;
}

export const RegisterActions: React.FC<RegisterActionsProps> = ({
  errors,
  loading,
  onLoginClick
}) => {
  return (
    <>
      {errors.general && (
        <div className="text-sm text-red-500 text-center bg-red-50 border border-red-200 rounded-lg p-3">
          {errors.general}
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        fullWidth
        loading={loading}
        disabled={loading}
      >
        {loading ? '가입 중...' : '회원가입'}
      </Button>

      <button
        type="button"
        onClick={onLoginClick}
        disabled={loading}
        className="w-full text-center text-sm text-gray-500 hover:text-gray-700 underline cursor-pointer transition-colors disabled:opacity-50"
      >
        로그인으로 돌아가기
      </button>
    </>
  );
};