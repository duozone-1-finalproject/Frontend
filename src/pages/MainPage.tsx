// pages/MainPage.tsx
import React, { useState, ReactNode, useEffect } from 'react';
import { Calendar, User, FileText, Settings, ChevronRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // React Router import 수정
import { useRequireAuth } from '../hooks/auth/useAuth';
import { useMainPage } from '../hooks/pages/useMainPage';
import { useMyPage } from '../hooks/pages/useMyPage';
import { SecuritiesDataService } from '../service/securitiesDataService';
// 기업 선택용 모달
import {CompanySearchModal} from '../components/main/Modal';
interface GenerationProgress {
  step: string;
  progress: number;
}





const MainPage: React.FC = () => {
  // 인증 확인
  useRequireAuth('/');
  const navigate = useNavigate(); // useNavigate hook 사용

  const {
    user,
    showUserMenu,
    handleProfileClick,
    handleMyPageClick,
    handleLogoutClick
  } = useMainPage();

  const { getEventsForDate } = useMyPage();

  // 오늘 일정 가져오기
  const today = new Date();
  const todayEvents = getEventsForDate(today);

  // 모달 열기
  const [showModal, setShowModal] = useState(false);

  const [showTodaySchedule, setShowTodaySchedule] = useState(false);
  
  // 초안 생성 관련 상태
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState<GenerationProgress>({ step: '', progress: 0 });
  const [generatedData, setGeneratedData] = useState<Record<string, any> | null>(null);
  const [showResultModal, setShowResultModal] = useState(false);
  
  const handleTodayScheduleClick = () => {
    setShowTodaySchedule(!showTodaySchedule);
  };

  // 증권신고서 초안 생성 핸들러
  const handleGenerateSecurities = async (companyCode: string) => {
    try {
      setIsGenerating(true);
      setGenerationProgress({ step: '초기화 중...', progress: 0 });
      
      console.log("🚀 [MainPage] 증권신고서 생성 시작");
      
      const result = await SecuritiesDataService.generateSecuritiesData(
        companyCode, // 기본 회사 코드
        (step: string, progress: number) => {
          setGenerationProgress({ step, progress });
          console.log(`📊 [Progress] ${step}: ${progress}%`);
        }
      );
      console.log("result.data: ", result.data)
      
      if (result.success && result.data) {
        setGeneratedData(result.data);
        setShowResultModal(true);
        console.log("✅ [MainPage] 데이터 생성 완료:", result.data);
      } else {
        throw new Error(result.error || "데이터 생성 실패");
      }
      
    } catch (error: any) {
      console.error("❌ [MainPage] 증권신고서 생성 실패:", error);
      alert(`증권신고서 생성 중 오류가 발생했습니다: ${error.message}`);
    } finally {
      setIsGenerating(false);
      setGenerationProgress({ step: '', progress: 0 });
    }
  };
// 결과 확인 후 다트뷰어로 이동
const handleGoToViewer = () => {
  if (generatedData) {
    try {
      // 세션스토리지에 잘 들어갔는지 확인
      const stored = sessionStorage.getItem('securitiesTemplateData');
      if (!stored) {
        console.warn("⚠️ sessionStorage에 데이터 없음 → 강제 저장");
        sessionStorage.setItem('securitiesTemplateData', JSON.stringify(generatedData));
      }
    } catch (err) {
      console.error("⚠️ sessionStorage 저장 실패, 강제 복구 시도:", err);
      sessionStorage.setItem('securitiesTemplateData', JSON.stringify(generatedData));
    }

    // 이제 확실히 저장된 상태에서만 이동
    navigate('/dartviewer');
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
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
                <span className="text-2xl font-semibold tracking-tight text-gray-900" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}>ComAIng</span>
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
                  onClick={handleProfileClick}
                  className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <User className="w-5 h-5" />
                </button>

                {/* User Menu Dropdown */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    <button
                      onClick={handleMyPageClick}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {user?.name ? `${user.name}님` : '마이페이지'}
                    </button>
                    <button
                      onClick={handleLogoutClick}
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
      </header>

      {/* Today Schedule Popup */}
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
                        <p className="text-sm text-gray-600">{event.time}</p>
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

      {/* Generation Progress Modal */}
      {isGenerating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">증권신고서 생성 중</h3>
                <p className="text-sm text-gray-600 mb-4">{generationProgress.step}</p>
                
                {/* Progress Bar */}
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
      {showResultModal && generatedData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">생성 완료</h3>
              <button
                onClick={() => setShowResultModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">증권신고서 초안이 생성되었습니다</h4>
                <p className="text-gray-600 mb-2">
                  회사명: {generatedData.company_name || '정보 없음'}
                </p>
                <p className="text-gray-600 mb-6">
                  CEO: {generatedData.ceo_name || '정보 없음'}
                </p>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowResultModal(false)}
                    className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    닫기
                  </button>
                  <button
                    onClick={handleGoToViewer}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    편집기로 이동
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center min-h-[calc(100vh-4rem)]">
          {/* Left Content */}
          <div className="flex-1 pr-12">
            <div className="max-w-2xl">
              {/* Main Title */}
              <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-6">
                <span className="text-blue-600">Smart Editor:</span>
                <br />
                증권신고서 초안
                <br />
                AI 자동생성
              </h1>

              {/* Description */}
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                복잡한 증권신고서 초안 작성을 돕습니다.
                AI 기반 자동 생성 시스템으로 정확하고 효율적인 증권신고서 초안을
                빠르게 작성하고, 오류 검토까지 한 번에 완료합니다.
              </p>

              {/* CTA Button */}
              <button
                // onClick={handleSecurityClick}
                onClick={() => setShowModal(true)}
                className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                    <span>생성 중...</span>
                  </>
                ) : (
                  <>
                    <span>증권신고서 초안 생성</span>
                    <ChevronRight className="ml-2 w-5 h-5" />
                  </>
                )}
              </button>
              <CompanySearchModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onSelectCompany={(corpCode: string) => {
                  setShowModal(false);
                  handleGenerateSecurities(corpCode);
                }}
              />
            </div>
          </div>

          {/* Right Content - Document Preview */}
          <div className="flex-1">
            <div className="relative">
              {/* Document Mockup */}
              <div className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span className="ml-4 text-sm text-gray-600">증권신고서 초안.docx</span>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="text-center">
                    <h3 className="text-lg font-bold text-gray-900">증권신고서</h3>
                    <p className="text-sm text-gray-600 mt-1">(주식회사 컴맹테크)</p>
                  </div>

                  <div className="space-y-3">
                    <div className="h-2 bg-gray-200 rounded"></div>
                    <div className="h-2 bg-gray-200 rounded w-4/5"></div>
                    <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-2 bg-gray-200 rounded w-5/6"></div>

                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-6">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
                        <span className="text-sm font-medium text-yellow-800">AI 검토 완료</span>
                      </div>
                      <p className="text-sm text-yellow-700 mt-1">
                        법적 요구사항 98% 충족, 추가 검토 권장 사항 2건
                      </p>
                    </div>

                    <div className="space-y-2 mt-4">
                      <div className="h-2 bg-gray-200 rounded w-full"></div>
                      <div className="h-2 bg-gray-200 rounded w-2/3"></div>
                      <div className="h-2 bg-gray-200 rounded w-4/5"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -left-4 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                자동생성 완료
              </div>
              <div className="absolute -bottom-4 -right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                검토 완료
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};



export default MainPage;