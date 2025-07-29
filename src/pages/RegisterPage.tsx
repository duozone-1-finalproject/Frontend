// RegisterPage.tsx
import React, { useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    name: ''
  });

  const [error, setError] = useState(''); // ✅ 에러 상태 추가

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await axios.post("/auth/register", formData);
      console.log("✅ 회원가입 성공:", res.data);
      alert("회원가입이 완료되었습니다. 로그인 해주세요."); // 사용자에게 알림
      navigate("/login");
    } catch (err: any) { 
      console.error("❌ 회원가입 실패:", err.response?.data || err);
      setError("회원가입 실패: " + (err.response?.data || "알 수 없는 오류")); // 백엔드 메시지 직접 표시
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-200 to-blue-100">
      <div className="absolute top-10 text-white text-3xl font-bold">Welcome</div>

      <div className="bg-white w-full max-w-md p-8 space-y-6 border rounded-lg shadow-lg">
        <div className="text-center text-lg font-bold text-blue-600 border-b pb-2 mb-4">
          회원가입
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder="아이디"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
          />
          <input
            type="password"
            name="password"
            placeholder="비밀번호"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
          />
          <input
            type="email"
            name="email"
            placeholder="이메일"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
          />
          <input
            type="text"
            name="name"
            placeholder="이름"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
          />

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded">
            회원가입
          </button>

          <div
            onClick={() => navigate('/')} // 로그인 페이지로 돌아가기
            className="text-center text-sm text-gray-500 underline cursor-pointer"
          >
            로그인으로 돌아가기
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;