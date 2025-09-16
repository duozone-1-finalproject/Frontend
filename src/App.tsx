import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import MainPage from "./pages/MainPage";
import RegisterPage from "./pages/RegisterPage";
import OAuthSuccessPage from './pages/OAuthSuccessPage';
import MyPage from "./pages/MyPage";
import DartViewer from "./pages/DartViewer";

// 인증 확인 함수 (토큰 체크 등)
const isAuthenticated = (): boolean => {
  // 여기서 실제 인증 로직 구현 (예: localStorage에서 토큰 확인)
  const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
  return !!token;
};

// ProtectedRoute 컴포넌트
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  return isAuthenticated() ? <>{children}</> : <Navigate to="/login" replace />;
};

// PublicRoute 컴포넌트 (로그인된 상태에서 로그인 페이지 접근 방지)
const PublicRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  return !isAuthenticated() ? <>{children}</> : <Navigate to="/main" replace />;
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* 루트 경로 - 인증 상태에 따라 리다이렉트 */}
        <Route path="/" element={
          isAuthenticated() ? <Navigate to="/main" replace /> : <Navigate to="/login" replace />
        } />
        
        {/* 공개 라우트 (로그인 안된 상태에서만 접근) */}
        <Route path="/login" element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        } />
        
        <Route path="/register" element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        } />
        
        {/* OAuth 성공 페이지는 항상 접근 가능 */}
        <Route path="/oauth-success" element={<OAuthSuccessPage />} />
        
        {/* 보호된 라우트 (로그인된 상태에서만 접근) */}
        <Route path="/main" element={
          <ProtectedRoute>
            <MainPage />
          </ProtectedRoute>
        } />
        
        <Route path="/mypage" element={
          <ProtectedRoute>
            <MyPage />
          </ProtectedRoute>
        } />
        
        <Route path="/dartviewer" element={
          <ProtectedRoute>
            <DartViewer />
          </ProtectedRoute>
        } />
        
        {/* 존재하지 않는 경로 */}
        <Route path="*" element={
          isAuthenticated() ? <Navigate to="/main" replace /> : <Navigate to="/login" replace />
        } />
      </Routes>
    </Router>
  );
};

export default App;