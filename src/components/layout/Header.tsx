// src/components/layout/Header.tsx
import React from 'react';
import { Menu, User, LogOut } from 'lucide-react';
import { Avatar } from '../common';

interface UserMenuProps {
  user: {
    name?: string;
    username?: string;
    email?: string;
  };
  onMyPageClick: () => void;
  onLogoutClick: () => void;
  onClose: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({
  user,
  onMyPageClick,
  onLogoutClick,
  onClose,
}) => {
  return (
    <div className="absolute right-4 top-20 w-96 bg-white shadow-lg rounded-lg flex flex-col z-20">
      {/* 배경 이미지 */}
      <img
        className="w-full h-48 object-cover rounded-t-lg"
        src="/img/profil.jpg"
        alt="Profile background"
      />
      
      {/* 프로필 정보 */}
      <div className="p-4 flex items-center gap-4">
        <Avatar
          src="/img/my_profil.jpg"
          alt="Profile"
          size="md"
          fallback={user.name?.[0] || user.username?.[0] || '?'}
        />
        <div className="flex-1">
          <div className="text-black text-xl font-medium">
            {user.name || user.username || "사용자"}
          </div>
          <div className="text-gray-600 text-sm">
            {user.email || "회계팀"}
          </div>
        </div>
      </div>
      
      {/* 액션 버튼들 */}
      <div className="p-2 pr-3 flex justify-between items-center border-t border-gray-200">
        <div className="flex gap-2">
          <button
            className="px-3 py-1.5 rounded hover:bg-purple-50 transition-colors"
            onClick={onMyPageClick}
          >
            <span className="text-purple-600 text-sm font-medium uppercase">
              MyPage
            </span>
          </button>
          <button
            className="px-3 py-1.5 rounded hover:bg-gray-50 transition-colors"
            onClick={onLogoutClick}
          >
            <span className="text-gray-600 text-sm font-medium">
              로그아웃
            </span>
          </button>
        </div>
        
        <div className="flex gap-2">
          <button 
            className="p-2 hover:bg-gray-100 rounded transition-colors"
            onClick={() => console.log('More options')}
          >
            <img
              src="/img/3menu_icon.png"
              alt="더보기"
              className="w-5 h-5"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

interface SideMenuProps {
  onChatbotClick: () => void;
  onClose: () => void;
}

const SideMenu: React.FC<SideMenuProps> = ({ onChatbotClick, onClose }) => {
  return (
    <div className="absolute left-4 top-20 w-56 bg-white shadow-lg rounded-r-lg flex flex-col z-20">
      {/* 헤더 */}
      <div className="p-4">
        <div className="text-black text-xl font-medium">keommaeng</div>
        <div className="text-gray-600 text-xs">보고서 생성</div>
      </div>
      
      {/* 메뉴 아이템들 */}
      <div className="py-2">
        <div
          className="relative h-12 flex items-center cursor-pointer hover:bg-gray-100 transition-colors"
          onClick={onChatbotClick}
        >
          <div
            className="absolute inset-y-1 left-1.5 w-[calc(100%-1.5rem)] h-10 rounded"
            style={{ background: "rgba(98, 0, 232, 0.12)" }}
          />
          <div className="relative flex items-center w-full h-full">
            <div className="w-6 h-6 ml-4 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs">
              AI
            </div>
            <div className="ml-4 text-purple-600 text-sm">
              보고서 생성 챗봇
            </div>
          </div>
        </div>
        
        {/* 추가 메뉴 아이템 placeholder */}
        <div className="h-12 hover:bg-gray-100 transition-colors" />
      </div>
      
      {/* 구분선 */}
      <div className="w-full h-px bg-gray-200 my-2" />
    </div>
  );
};

interface HeaderProps {
  title?: string;
  subtitle?: string;
  user?: {
    name?: string;
    username?: string;
    email?: string;
  } | null;
  showUserMenu?: boolean;
  showSideMenu?: boolean;
  onMenuClick?: () => void;
  onProfileClick?: () => void;
  onMyPageClick?: () => void;
  onLogoutClick?: () => void;
  onChatbotClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  title = "keommaeng",
  subtitle = "보고서 생성",
  user,
  showUserMenu = false,
  showSideMenu = false,
  onMenuClick,
  onProfileClick,
  onMyPageClick,
  onLogoutClick,
  onChatbotClick,
}) => {
  return (
    <div className="w-full flex justify-between items-center px-6 py-4 border-b bg-white relative z-10">
      {/* 로고/타이틀 */}
      <div className="flex items-end space-x-2">
        <h1 className="text-3xl font-extrabold text-black">{title}</h1>
        {subtitle && <span className="text-sm text-gray-500">{subtitle}</span>}
      </div>
      
      {/* 우측 액션 버튼들 */}
      <div className="flex space-x-4">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            aria-label="메뉴"
          >
            <img src="/img/menu_icon.png" alt="Menu" className="w-6 h-6" />
          </button>
        )}
        
        {user && onProfileClick && (
          <button
            onClick={onProfileClick}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            aria-label="프로필"
          >
            <img src="/img/profil_icon.png" alt="Profile" className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* 사용자 메뉴 */}
      {showUserMenu && user && onMyPageClick && onLogoutClick && (
        <UserMenu
          user={user}
          onMyPageClick={onMyPageClick}
          onLogoutClick={onLogoutClick}
          onClose={() => {}}
        />
      )}

      {/* 사이드 메뉴 */}
      {showSideMenu && onChatbotClick && (
        <SideMenu
          onChatbotClick={onChatbotClick}
          onClose={() => {}}
        />
      )}
    </div>
  );
};

export default Header;