// pages/RegisterPage.tsx (리팩토링된 버전)
import React from 'react';
import { useRegister } from '../hooks/auth/useRegister';
import { RegisterForm } from '../components/auth/register'

const RegisterPage: React.FC = () => {
  const {
    formData,
    errors,
    loading,
    handleChange,
    handleSubmit,
    handleLoginClick
  } = useRegister();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-200 to-blue-100 p-4">
      <div className="absolute top-10 text-white text-3xl font-bold">Welcome</div>
      
      <RegisterForm 
        formData={formData}
        errors={errors}
        loading={loading}
        onInputChange={handleChange}
        onSubmit={handleSubmit}
        onLoginClick={handleLoginClick}
      />
    </div>
  );
};

export default RegisterPage;