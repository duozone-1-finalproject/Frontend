// pages/MainPage.tsx (리팩토링된 버전)
import React, { useEffect } from 'react';
import { useRequireAuth } from '../hooks/auth/useAuth';
import { useMainPage } from '../hooks/pages/useMainPage';
import { MainLayout } from '../components/layout';
import { 
  HeroSection, 
  PageTitleSection, 
  SecurityButtonsSection 
} from '../components/main/MainPageSections';

const MainPage: React.FC = () => {
  // 인증 확인
  useRequireAuth('/');

  const {
    user,
    showUserMenu,
    showSideMenu,
    handleProfileClick,
    handleMenuClick,
    handleMyPageClick,
    handleLogoutClick,
    handleChatbotClick,
    handleSecurityClick
  } = useMainPage();


  return (
    <MainLayout
      user={user}
      showUserMenu={showUserMenu}
      showSideMenu={showSideMenu}
      onMenuClick={handleMenuClick}
      onProfileClick={handleProfileClick}
      onMyPageClick={handleMyPageClick}
      onLogoutClick={handleLogoutClick}
      onChatbotClick={handleChatbotClick}
    >
      <HeroSection />
      <PageTitleSection />
      <SecurityButtonsSection onSecurityClick={handleSecurityClick} />
    </MainLayout>
  );
};

export default MainPage;