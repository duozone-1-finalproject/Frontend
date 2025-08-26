// src/components/layout/MainLayout.tsx
import React from 'react';
import Header from './Header';

interface MainLayoutProps {
  children: React.ReactNode;
  user?: {
    name?: string;
    username?: string;
    email?: string;
  } | null;
  showHeader?: boolean;
  showUserMenu?: boolean;
  showSideMenu?: boolean;
  onMenuClick?: () => void;
  onProfileClick?: () => void;
  onMyPageClick?: () => void;
  onLogoutClick?: () => void;
  onChatbotClick?: () => void;
  headerTitle?: string;
  headerSubtitle?: string;
  className?: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  user,
  showHeader = true,
  showUserMenu = false,
  showSideMenu = false,
  onMenuClick,
  onProfileClick,
  onMyPageClick,
  onLogoutClick,
  onChatbotClick,
  headerTitle,
  headerSubtitle,
  className = '',
}) => {
  return (
    <div className={`min-h-screen flex flex-col bg-white overflow-hidden ${className}`}>
      {/* 헤더 */}
      {showHeader && (
        <Header
          title={headerTitle}
          subtitle={headerSubtitle}
          user={user}
          showUserMenu={showUserMenu}
          showSideMenu={showSideMenu}
          onMenuClick={onMenuClick}
          onProfileClick={onProfileClick}
          onMyPageClick={onMyPageClick}
          onLogoutClick={onLogoutClick}
          onChatbotClick={onChatbotClick}
        />
      )}
      
      {/* 메인 컨텐츠 */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

// 페이지 레이아웃 (마이페이지 등에서 사용)
interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
  actions?: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  background?: 'white' | 'gray' | 'slate';
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  title,
  actions,
  maxWidth = '2xl',
  padding = 'lg',
  background = 'slate',
}) => {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-4xl',
    xl: 'max-w-5xl',
    '2xl': 'max-w-6xl',
    full: 'max-w-none',
  };

  const paddingClasses = {
    none: '',
    sm: 'px-4 py-6',
    md: 'px-6 py-8',
    lg: 'px-6 py-8',
  };

  const backgroundClasses = {
    white: 'bg-white',
    gray: 'bg-gray-100',
    slate: 'bg-slate-100',
  };

  return (
    <div className={`min-h-screen ${backgroundClasses[background]}`}>
      {/* 페이지 헤더 */}
      <div className="bg-white shadow-sm border-b">
        <div className={`${maxWidthClasses[maxWidth]} mx-auto px-6 py-4`}>
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold text-slate-800">{title}</h1>
            {actions && <div className="flex items-center gap-4">{actions}</div>}
          </div>
        </div>
      </div>

      {/* 페이지 컨텐츠 */}
      <div className={`${maxWidthClasses[maxWidth]} mx-auto ${paddingClasses[padding]}`}>
        {children}
      </div>
    </div>
  );
};

export default MainLayout;