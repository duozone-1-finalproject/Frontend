// pages/MainPage.tsx - Refactored
import React, { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useRequireAuth } from '../hooks/auth/useAuth';
import { useMainPage } from '../hooks/pages/useMainPage';
import { useMyPage } from '../hooks/pages/useMyPage';
import { useSecuritiesGeneration } from '../hooks/dart-viewer/useSecuritiesGeneration';
import { useCompanySelector } from '../hooks/main/useCompanySelector';

// Components
import { Header } from '../components/main/Header';
import { LeftContent } from '../components/main/LeftContent';
import { RightContent } from '../components/main/RightContent';
import { GenerationResultModal } from '../components/main/GenerationResultModal';

const MainPage: React.FC = () => {
  // 인증 확인
  useRequireAuth('/');

  // Custom hooks
  const {
    user,
    showUserMenu,
    handleProfileClick,
    handleMyPageClick,
    handleLogoutClick
  } = useMainPage();

  const { getEventsForDate } = useMyPage();

  const {
    isGenerating,
    generationProgress,
    generatedData,
    showResultModal,
    setShowResultModal,
    handleGenerateSecurities,
    handleGoToViewer
  } = useSecuritiesGeneration();

  // 회사 목록 미리 로드용
  const { companies, isLoading: companiesLoading, loadCompanies } = useCompanySelector();

  // 회사 삭제 후 목록 새로고침
  const handleCompanyDeleted = (corpCode: string) => {
    loadCompanies(123); // 강제 새로고침
  };

  // 페이지 로드 시 회사 목록 미리 로드
  useEffect(() => {
    loadCompanies(123);
  }, []);

  // 오늘 일정 가져오기
  const today = new Date();
  const todayEvents = getEventsForDate(today);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <Header
        todayEvents={todayEvents}
        showUserMenu={showUserMenu}
        userName={user?.name}
        userId={123}
        companies={companies}
        companiesLoading={companiesLoading}
        onProfileClick={handleProfileClick}
        onMyPageClick={handleMyPageClick}
        onLogoutClick={handleLogoutClick}
        onCompanyDeleted={handleCompanyDeleted}
      />

      {/* Generation Progress Modal */}
      {isGenerating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">증권신고서 생성 중</h3>
                <p className="text-sm text-gray-600 mb-4">{generationProgress.step}</p>
                
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${generationProgress.progress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500">{generationProgress.progress}% 완료</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Generation Result Modal */}
      <GenerationResultModal
        isOpen={showResultModal}
        generatedData={generatedData}
        onClose={() => setShowResultModal(false)}
        onGoToViewer={handleGoToViewer}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center min-h-[calc(100vh-4rem)]">
          <LeftContent
            isGenerating={isGenerating}
            onGenerateSecurities={handleGenerateSecurities}
          />
          <RightContent />
        </div>
      </main>
    </div>
  );
};

export default MainPage;