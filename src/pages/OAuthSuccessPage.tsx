// src/pages/OAuthSuccessPage.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';

const OAuthSuccessPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOAuthToken = async () => {
      console.log("📍 OAuthSuccessPage useEffect 실행됨"); // 디버깅 로그.

      try {
        // 백엔드의 새로운 토큰 발급 엔드포인트로 요청
        // 이 요청은 서버가 Refresh Token 쿠키를 읽고 Access Token을 발급함함.
        // Spring Security가 자동으로 쿠키를 보내주어 별도의 설정x
        const response = await axios.get('/auth/oauth/tokens');
        const { accessToken } = response.data; 

        if (accessToken) {
          console.log("✅ Access Token 수신 완료. 로컬 스토리지에 저장 시도:", accessToken); // 디버깅 로그
          localStorage.setItem('accessToken', accessToken);

          console.log("⏳ 1.5초 후 메인 페이지로 이동 예정..."); // 디버깅 로그
          setTimeout(() => {
            console.log("🚀 메인 페이지로 이동 시작!"); // 디버깅 로그
            navigate('/main');
          }, 1500);
        } else {
          console.error("❌ Access Token이 응답에 포함되지 않았습니다."); // 디버깅 로그
          alert('로그인 토큰을 받을 수 없습니다.');
          navigate('/login');
        }
      } catch (error) {
        console.error("❌ OAuth 토큰 요청 실패:", error); // 디버깅 로그
        alert('소셜 로그인 처리 중 오류가 발생했습니다.');
        navigate('/login');
      }
    };

    fetchOAuthToken(); // 함수 호출
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