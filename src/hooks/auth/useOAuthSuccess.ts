// src/hooks/auth/useOAuthSuccess.ts

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';

type ProcessingState = 'loading' | 'success' | 'error';

export const useOAuthSuccess = () => {
  const navigate = useNavigate();
  const [processingState, setProcessingState] = useState<ProcessingState>('loading');
  const [message, setMessage] = useState('🔐 로그인 처리 중...');

  useEffect(() => {
    const fetchOAuthToken = async () => {
      try {
        setProcessingState('loading');
        setMessage('소셜 로그인 처리 중...');

        // ✅ [수정] GET /auth/oauth/tokens -> POST /auth/refresh 로 변경
        const response = await axios.post('/auth/refresh', {});
        const { accessToken } = response.data;

        if (accessToken) {
          localStorage.setItem('accessToken', accessToken);
          
          setProcessingState('success');
          setMessage('로그인 성공!');

          // 성공 후 메인 페이지로 이동
          setTimeout(() => {
            navigate('/main');
          }, 1500);
        } else {
          throw new Error('Access Token이 응답에 포함되지 않았습니다.');
        }
      } catch (error: any) {
        console.error('OAuth success processing failed:', error);
        setProcessingState('error');
        setMessage('소셜 로그인 처리 실패');

        // 에러 후 로그인 페이지로 이동
        setTimeout(() => {
          navigate('/');
        }, 3000);
      }
    };

    fetchOAuthToken();
  }, [navigate]);

  const handleManualRedirect = () => {
    navigate('/');
  };

  return {
    processingState,
    message,
    handleManualRedirect
  };
};