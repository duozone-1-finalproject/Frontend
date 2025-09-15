// components/main/Header.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, User, ChevronDown, Building, Trash2, X } from 'lucide-react';
import type { CalendarEvent } from '../../types/calendar';

interface Company {
  corpCode: string;
  companyName: string;
}

interface HeaderProps {
  todayEvents: CalendarEvent[];
  showUserMenu: boolean;
  userName?: string;
  userId?: number;
  companies: Company[];
  companiesLoading: boolean;
  onProfileClick: () => void;
  onMyPageClick: () => void;
  onLogoutClick: () => void;
  onCompanyDeleted?: (corpCode: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  todayEvents,
  showUserMenu,
  userName,
  userId = 123,
  companies,
  companiesLoading,
  onProfileClick,
  onMyPageClick,
  onLogoutClick,
  onCompanyDeleted
}) => {
  const navigate = useNavigate();
  const [showTodaySchedule, setShowTodaySchedule] = useState(false);
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);

  const handleTodayScheduleClick = () => {
    setShowTodaySchedule(!showTodaySchedule);
  };

  // 회사 드롭다운 토글
  const handleCompanyDropdownToggle = () => {
    setShowCompanyDropdown(!showCompanyDropdown);
    if (!showCompanyDropdown) {
      setDeleteMode(false); // 드롭다운 열 때 삭제 모드 해제
    }
  };

  // 삭제 모드 토글
  const handleDeleteModeToggle = () => {
    setDeleteMode(!deleteMode);
  };

  // 회사 선택 핸들러
  const onCompanySelect = (company: Company) => {
    if (deleteMode) return; // 삭제 모드에서는 회사 선택 비활성화

    const params = new URLSearchParams({
      corpCode: company.corpCode,
      companyName: company.companyName
    });
    navigate(`/dartviewer?${params.toString()}`);
    setShowCompanyDropdown(false);
  };

  // 회사 삭제 핸들러
  const handleCompanyDelete = async (company: Company) => {
    if (!window.confirm(`'${company.companyName}' 회사의 증권신고서를 삭제하시겠습니까?`)) return;

    try {
      const { dartViewerApi } = await import('../../api/dartViewerApi');
      await dartViewerApi.deleteCompany({ user_id: userId, corp_code: company.corpCode });

      alert('회사가 성공적으로 삭제되었습니다.');

      // 부모 컴포넌트에 삭제 완료 알림
      if (onCompanyDeleted) {
        onCompanyDeleted(company.corpCode);
      }
    } catch (error: any) {
      console.error('회사 삭제 오류:', error);
      const errorMessage = error.message || '회사 삭제 중 오류가 발생했습니다.';
      alert(errorMessage);
    }
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
            {/* Company Selector */}
            <div className="relative">
              <button
                onClick={handleCompanyDropdownToggle}
                className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg border transition-colors"
              >
                <Building className="w-4 h-4" />
                <span>진행중인 프로젝트</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showCompanyDropdown ? 'rotate-180' : ''}`} />
              </button>

              {/* Company Dropdown */}
              {showCompanyDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-50 border border-gray-200 max-h-60 overflow-y-auto">
                  {/* Delete Mode Toggle Header */}
                  {!companiesLoading && companies.length > 0 && (
                    <div className="px-4 py-2 border-b border-gray-200 bg-gray-50">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600 font-medium">프로젝트 관리</span>
                        <button
                          onClick={handleDeleteModeToggle}
                          className={`p-1 rounded transition-colors ${
                            deleteMode
                              ? 'text-red-600 bg-red-100 hover:bg-red-200'
                              : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                          }`}
                          title={deleteMode ? "삭제 모드 해제" : "삭제 모드 활성화"}
                        >
                          {deleteMode ? <X className="w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Company List */}
                  <div className="py-1">
                    {companiesLoading ? (
                      <div className="px-4 py-3 text-sm text-gray-500">
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                          <span>회사 목록을 불러오는 중...</span>
                        </div>
                      </div>
                    ) : companies.length === 0 ? (
                      <div className="px-4 py-3 text-sm text-gray-500">
                        진행중인 프로젝트가 없습니다.
                      </div>
                    ) : (
                      companies.map((company) => (
                        <div
                          key={company.corpCode}
                          className={`flex items-center ${deleteMode ? 'px-2 py-1' : 'px-4 py-2'} hover:bg-gray-100 transition-colors`}
                        >
                          {/* Company Info */}
                          <button
                            onClick={() => onCompanySelect(company)}
                            className={`flex-1 text-left text-sm text-gray-700 ${deleteMode ? 'px-2 py-1' : ''} ${deleteMode ? 'cursor-default' : 'cursor-pointer'}`}
                            disabled={deleteMode}
                          >
                            <div className="flex flex-col">
                              <span className="font-medium">{company.companyName}</span>
                              <span className="text-xs text-gray-500">{company.corpCode}</span>
                            </div>
                          </button>

                          {/* Delete Button */}
                          {deleteMode && (
                            <button
                              onClick={() => handleCompanyDelete(company)}
                              className="ml-2 p-1 text-red-500 hover:text-red-700 hover:bg-red-100 rounded transition-colors"
                              title="회사 삭제"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

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