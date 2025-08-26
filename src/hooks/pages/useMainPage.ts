// src/hooks/pages/useMainPage.ts
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';

export const useMainPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSideMenu, setShowSideMenu] = useState(false);

  // 프로필 버튼 클릭 (사용자 메뉴 토글)
  const handleProfileClick = () => {
    setShowUserMenu(prev => !prev);
    setShowSideMenu(false); // 다른 메뉴 닫기
  };

  // 햄버거 메뉴 클릭 (사이드 메뉴 토글)
  const handleMenuClick = () => {
    setShowSideMenu(prev => !prev);
    setShowUserMenu(false); // 다른 메뉴 닫기
  };

  // 마이페이지로 이동
  const handleMyPageClick = () => {
    navigate('/mypage');
    setShowUserMenu(false);
  };

  // 로그아웃 처리
  const handleLogoutClick = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      // 에러가 발생해도 로그인 페이지로 이동
      navigate('/');
    }
  };

  // 챗봇 페이지로 이동
  const handleChatbotClick = () => {
    navigate('/dartviewer');
    setShowSideMenu(false);
  };

  // 증권 버튼 클릭 (챗봇으로 이동)
  const handleSecurityClick = () => {
    navigate('/dartviewer');
  };

  // 메뉴 외부 클릭으로 닫기
  const closeAllMenus = () => {
    setShowUserMenu(false);
    setShowSideMenu(false);
  };

  return {
    // 상태
    user,
    showUserMenu,
    showSideMenu,
    
    // 액션 함수
    handleProfileClick,
    handleMenuClick,
    handleMyPageClick,
    handleLogoutClick,
    handleChatbotClick,
    handleSecurityClick,
    closeAllMenus
  };
};