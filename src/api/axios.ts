// src/api/axios.ts
import axios from "axios";

const TOKEN_KEY = "accessToken";

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 공통 응답 인터셉터 (선택사항 - 필요에 따라 추가)
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // 401 에러 시 토큰 제거 및 리다이렉트 등의 공통 처리
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      // 필요시 로그인 페이지로 리다이렉트
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default instance;

