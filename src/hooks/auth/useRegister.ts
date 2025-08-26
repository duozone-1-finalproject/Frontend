// src/hooks/auth/useRegister.ts
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';

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

export const useRegister = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    name: ''
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // 해당 필드의 에러 지우기
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // 아이디 검증
    if (!formData.username.trim()) {
      newErrors.username = '아이디를 입력해주세요.';
    } else if (formData.username.length < 3) {
      newErrors.username = '아이디는 3자 이상이어야 합니다.';
    }

    // 비밀번호 검증
    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요.';
    } else if (formData.password.length < 6) {
      newErrors.password = '비밀번호는 6자 이상이어야 합니다.';
    }

    // 비밀번호 확인
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호를 다시 입력해주세요.';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    }

    // 이메일 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식을 입력해주세요.';
    }

    // 이름 검증
    if (!formData.name.trim()) {
      newErrors.name = '이름을 입력해주세요.';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = '이름은 2자 이상이어야 합니다.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      const result = await register({
        username: formData.username.trim(),
        password: formData.password,
        email: formData.email.trim(),
        name: formData.name.trim(),
      });

      if (result.success) {
        alert('회원가입이 완료되었습니다. 로그인 해주세요.');
        navigate('/');
      } else {
        setErrors({ general: result.error });
      }
    } catch (error) {
      setErrors({ general: '회원가입 중 오류가 발생했습니다. 다시 시도해주세요.' });
    } finally {
      setLoading(false);
    }
  };

  const handleLoginClick = () => {
    navigate('/');
  };

  return {
    // 상태
    formData,
    errors,
    loading,
    
    // 액션 함수
    handleChange,
    handleSubmit,
    handleLoginClick
  };
};