// LoginPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios'; 

const LoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('/auth/login', form);
      const { accessToken } = response.data;
      localStorage.setItem('accessToken', accessToken);
      navigate('/main');
    } catch (err) {
      setError('로그인 실패: 아이디나 비밀번호를 확인하세요.');
    }
  };

  const redirectToOAuth = (provider: string) => {
    // 백엔드의 OAuth2 인증 시작 부분 URL로 직접 리다이렉션함.
    window.location.href = `${axios.defaults.baseURL}/oauth2/authorization/${provider}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-200 to-blue-100">
      <div className="absolute top-10 text-white text-3xl font-bold">Welcome</div>

      <div className="bg-white w-full max-w-md p-8 space-y-6 border rounded-lg shadow-lg">
        {/* 회원 유형 */}
        <div className="text-center text-lg font-bold text-blue-600 border-b pb-2 mb-4">
          기업 회원
        </div>

        {/* 입력 폼 */}
        <div className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder="아이디"
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
          />
          <input
            type="password"
            name="password"
            placeholder="비밀번호"
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
          />

          <div className="text-sm text-gray-600">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="form-checkbox" />
              <span>로그인 유지</span>
              <input type="checkbox" className="form-checkbox ml-6" />
              <span>아이디 저장</span>
            </label>
          </div>

          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}

          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
          >
            로그인
          </button>

          <div
            //AuthController의 /auth/register 엔드포인트로 이동
            onClick={() => navigate('/register')} // React Router를 통해 /register 페이지로 이동함.
            className="text-center text-sm text-gray-500 underline cursor-pointer"
          >
            회원가입
          </div>
        </div>

        {/* 소셜 로그인 */}
        <div className="border-t pt-4 text-center text-sm text-gray-500">
          소셜 계정으로 간편 로그인
        </div>

        <div className="flex justify-between px-8">
          <img
            src="/img/naver.png"
            alt="Naver"
            onClick={() => redirectToOAuth('naver')}
            className="w-10 h-10 rounded-full cursor-pointer"
          />
          <img
            src="/img/kakao.png"
            alt="Kakao"
            onClick={() => redirectToOAuth('kakao')}
            className="w-10 h-10 rounded-full cursor-pointer"
          />
          <img
            src="/img/google.png"
            alt="Google"
            onClick={() => redirectToOAuth('google')}
            className="w-10 h-10 rounded-full border border-gray-300 bg-white shadow-sm cursor-pointer"
          />
        </div>

        <p className="text-xs text-center text-gray-400 mt-4">
          Copyright 2025, --, All rights reserved
        </p>
      </div>
    </div>
  );
};

export default LoginPage;