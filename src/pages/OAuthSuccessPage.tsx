// src/pages/OAuthSuccessPage.tsx
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';

const OAuthSuccessPage = () => {
  const navigate = useNavigate();
  const hasRun = useRef(false); // 중복 실행 방지

  useEffect(() => {
    if (hasRun.current) return; // 이미 실행했으면 종료
    hasRun.current = true;

    const fetchOAuthToken = async () => {
      console.log("📍 OAuthSuccessPage useEffect 실행됨");

      try {
        const response = await axios.get('/auth/oauth/tokens');
        const { accessToken } = response.data; 

        if (accessToken) {
          console.log("✅ Access Token 수신 완료:", accessToken);
          localStorage.setItem('accessToken', accessToken);

          setTimeout(() => {
            console.log("🚀 메인 페이지로 이동 시작!");
            navigate('/main');
          }, 1500);
        } else {
          console.error("❌ Access Token이 응답에 포함되지 않았습니다.");
          navigate('/login');
        }
      } catch (error) {
        console.log("🔄 토큰 갱신 필요, 메인 페이지로 이동...");
        setTimeout(() => {
          navigate('/main');
        }, 2000);
      }
    };

    fetchOAuthToken();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-700">🔐 로그인 처리 중...</h2>
        <p className="text-sm text-gray-500 mt-2">잠시 후 자동으로 이동합니다.</p>
      </div>
    </div>
  );
};

export default OAuthSuccessPage;