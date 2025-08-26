// components/auth/RegisterForm.tsx
import React from 'react';
import { Card } from '../../common';
import { RegisterInputs } from './RegisterInput';
import { RegisterActions } from './RegisterActions';
import { RegisterNotice } from './RegisterNotice';

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
  general?: string;
}

interface RegisterFormComponentProps {
  formData: FormData;
  errors: FormErrors;
  loading: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onLoginClick: () => void;
}

export const RegisterFormComponent: React.FC<RegisterFormComponentProps> = ({
  formData,
  errors,
  loading,
  onInputChange,
  onSubmit,
  onLoginClick
}) => {
  return (
    <Card className="w-full max-w-md">
      <div className="text-center text-lg font-bold text-blue-600 border-b border-gray-200 pb-4 mb-6">
        회원가입
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <RegisterInputs
          formData={formData}
          errors={errors}
          loading={loading}
          onInputChange={onInputChange}
        />

        <RegisterActions
          errors={errors}
          loading={loading}
          onLoginClick={onLoginClick}
        />
      </form>

      <RegisterNotice />

      <div className="text-xs text-center text-gray-400 mt-6 pt-4 border-t border-gray-200">
        Copyright 2025, keommaeng, All rights reserved
      </div>
    </Card>
  );
};