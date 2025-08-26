// src/hooks/auth/useLogin.ts
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import type { LoginForm, OAuthProvider } from '../../types/auth';

export const useLogin = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<LoginForm>({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [saveId, setSaveId] = useState(false);

  // 컴포넌트 마운트 시 저장된 아이디 불러오기
  useEffect(() => {
    const savedUsername = localStorage.getItem('savedUsername');
    if (savedUsername) {
      setForm(prev => ({ ...prev, username: savedUsername }));
      setSaveId(true);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const validateForm = (): boolean => {
    if (!form.username.trim()) {
      setError('아이디를 입력해주세요.');
      return false;
    }
    if (!form.password) {
      setError('비밀번호를 입력해주세요.');
      return false;
    }
    return true;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/auth/login', form);
      const { accessToken } = response.data;
      
      localStorage.setItem('accessToken', accessToken);
      
      // 아이디 저장 옵션 처리
      if (saveId) {
        localStorage.setItem('savedUsername', form.username);
      } else {
        localStorage.removeItem('savedUsername');
      }
      
      navigate('/main');
    } catch (err: any) {
      setError(
        err.response?.data?.message || 
        '로그인 실패: 아이디나 비밀번호를 확인하세요.'
      );
    } finally {
      setLoading(false);
    }
  };

  const redirectToOAuth = (provider: OAuthProvider) => {
    window.location.href = `${axios.defaults.baseURL}/oauth2/authorization/${provider}`;
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  return {
    // 상태
    form,
    error,
    loading,
    rememberMe,
    saveId,
    
    // 상태 변경 함수
    setRememberMe,
    setSaveId,
    handleChange,
    
    // 액션 함수
    handleLogin,
    redirectToOAuth,
    handleRegisterClick
  };
};