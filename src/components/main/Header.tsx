// components/main/Header.tsx
import React, { useState } from 'react';
import { Calendar, User } from 'lucide-react';
import type { CalendarEvent } from '../../types/calendar';

interface HeaderProps {
  todayEvents: CalendarEvent[];
  showUserMenu: boolean;
  userName?: string;
  onProfileClick: () => void;
  onMyPageClick: () => void;
  onLogoutClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  todayEvents,
  showUserMenu,
  userName,
  onProfileClick,
  onMyPageClick,
  onLogoutClick
}) => {
  const [showTodaySchedule, setShowTodaySchedule] = useState(false);

  const handleTodayScheduleClick = () => {
    setShowTodaySchedule(!showTodaySchedule);
  };
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              {/* KM Logo */}
              <img
                src="/img/mainlogo.png"
                alt=" ComAIng 로고"
                className="w-20 h-20 object-contain"
              />
              {/* ComAIng Text */}
              <span 
                className="text-2xl font-semibold tracking-tight text-gray-900" 
                style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}
              >
                ComAIng
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-8">
            <button
              onClick={handleTodayScheduleClick}
              className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <Calendar className="w-5 h-5" />
              {todayEvents.length > 0 && (
                <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                  {todayEvents.length}
                </span>
              )}
            </button>

            <div className="relative">
              <button
                onClick={onProfileClick}
                className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <User className="w-5 h-5" />
              </button>

              {/* User Menu Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                  <button
                    onClick={onMyPageClick}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {userName ? `${userName}님` : '마이페이지'}
                  </button>
                  <button
                    onClick={onLogoutClick}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    로그아웃
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>

      {/* Today Schedule Modal */}
      {showTodaySchedule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">오늘의 일정</h3>
              <button
                onClick={() => setShowTodaySchedule(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4">
              {todayEvents.length > 0 ? (
                <div className="space-y-3">
                  {todayEvents.map((event) => (
                    <div key={event.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{event.title}</p>
                        {event.time && (
                          <p className="text-sm text-gray-600">{event.time}</p>
                        )}
                        {event.description && (
                          <p className="text-sm text-gray-500 mt-1">{event.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">오늘 등록된 일정이 없습니다.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};