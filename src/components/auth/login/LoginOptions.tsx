// components/auth/LoginOptions.tsx
import React from 'react';

interface LoginOptionsProps {
  rememberMe: boolean;
  saveId: boolean;
  loading: boolean;
  onRememberMeChange: (checked: boolean) => void;
  onSaveIdChange: (checked: boolean) => void;
}

export const LoginOptions: React.FC<LoginOptionsProps> = ({
  rememberMe,
  saveId,
  loading,
  onRememberMeChange,
  onSaveIdChange
}) => {
  return (
    <div className="flex items-center gap-6 text-sm text-gray-600">
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={rememberMe}
          onChange={(e) => onRememberMeChange(e.target.checked)}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          disabled={loading}
        />
        <span>로그인 유지</span>
      </label>
      
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={saveId}
          onChange={(e) => onSaveIdChange(e.target.checked)}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          disabled={loading}
        />
        <span>아이디 저장</span>
      </label>
    </div>
  );
};
