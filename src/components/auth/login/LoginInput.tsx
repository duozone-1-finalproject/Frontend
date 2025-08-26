// components/auth/LoginInputs.tsx
import React from 'react';
import { User, Lock } from 'lucide-react';
import { Input } from '../../common';

interface LoginInputsProps {
  form: { username: string; password: string };
  loading: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const LoginInputs: React.FC<LoginInputsProps> = ({
  form,
  loading,
  onInputChange
}) => {
  return (
    <>
      <Input
        type="text"
        name="username"
        placeholder="아이디"
        value={form.username}
        onChange={onInputChange}
        startIcon={<User className="w-4 h-4" />}
        fullWidth
        disabled={loading}
      />

      <Input
        type="password"
        name="password"
        placeholder="비밀번호"
        value={form.password}
        onChange={onInputChange}
        startIcon={<Lock className="w-4 h-4" />}
        fullWidth
        disabled={loading}
      />
    </>
  );
};