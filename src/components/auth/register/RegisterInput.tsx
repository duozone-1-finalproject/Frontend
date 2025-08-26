// components/auth/RegisterInputs.tsx
import React from 'react';
import { User, Lock, Mail, UserCheck } from 'lucide-react';
import { Input } from '../../common';

interface FormData {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
  name: string;
}

interface FormErrors {
  username?: string;
  password?: string;
  confirmPassword?: string;
  email?: string;
  name?: string;
}

interface RegisterInputsProps {
  formData: FormData;
  errors: FormErrors;
  loading: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const RegisterInputs: React.FC<RegisterInputsProps> = ({
  formData,
  errors,
  loading,
  onInputChange
}) => {
  return (
    <>
      <Input
        type="text"
        name="username"
        placeholder="아이디 (3자 이상)"
        value={formData.username}
        onChange={onInputChange}
        startIcon={<User className="w-4 h-4" />}
        error={errors.username}
        fullWidth
        disabled={loading}
        required
      />

      <Input
        type="password"
        name="password"
        placeholder="비밀번호 (6자 이상)"
        value={formData.password}
        onChange={onInputChange}
        startIcon={<Lock className="w-4 h-4" />}
        error={errors.password}
        fullWidth
        disabled={loading}
        required
      />

      <Input
        type="password"
        name="confirmPassword"
        placeholder="비밀번호 확인"
        value={formData.confirmPassword}
        onChange={onInputChange}
        startIcon={<Lock className="w-4 h-4" />}
        error={errors.confirmPassword}
        fullWidth
        disabled={loading}
        required
      />

      <Input
        type="email"
        name="email"
        placeholder="이메일"
        value={formData.email}
        onChange={onInputChange}
        startIcon={<Mail className="w-4 h-4" />}
        error={errors.email}
        fullWidth
        disabled={loading}
        required
      />

      <Input
        type="text"
        name="name"
        placeholder="이름"
        value={formData.name}
        onChange={onInputChange}
        startIcon={<UserCheck className="w-4 h-4" />}
        error={errors.name}
        fullWidth
        disabled={loading}
        required
      />
    </>
  );
};