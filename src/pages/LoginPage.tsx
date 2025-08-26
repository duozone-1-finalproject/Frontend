// pages/LoginPage.tsx (리팩토링된 버전)
import React from 'react';
import { useLogin } from '../hooks/auth/useLogin';
import { LoginFormComponent } from '../components/auth/login/LoginForm';

const LoginPage: React.FC = () => {
  const {
    form,
    error,
    loading,
    rememberMe,
    saveId,
    setRememberMe,
    setSaveId,
    handleChange,
    handleLogin,
    redirectToOAuth,
    handleRegisterClick
  } = useLogin();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-200 to-blue-100 p-4">
      <div className="absolute top-10 text-white text-3xl font-bold">Welcome</div>
      
      <LoginFormComponent
        form={form}
        error={error}
        loading={loading}
        rememberMe={rememberMe}
        saveId={saveId}
        onInputChange={handleChange}
        onLogin={handleLogin}
        onOAuthLogin={redirectToOAuth}
        onRegisterClick={handleRegisterClick}
        onRememberMeChange={setRememberMe}
        onSaveIdChange={setSaveId}
      />
    </div>
  );
};

export default LoginPage;