// src/pages/MyPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Settings, User, Mail, Building, Clock, FileText } from 'lucide-react';
import axios from '../api/axios';

// 사용자 정보 인터페이스
interface UserDto {
  username: string;
  email: string;
  role: string;
  name?: string;
}

const MyPage = () => {
  const navigate = useNavigate();
  
  const [currentUser, setCurrentUser] = useState<UserDto | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // JWT 검증 및 사용자 정보 가져오기 (MainPage.tsx와 동일한 로직)
  useEffect(() => {
    const checkTokenAndFetchUser = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        navigate("/"); // 로그인 페이지로 리디렉션
        return;
      }

      try {
        const res = await axios.get<UserDto>("/users/me");
        console.log("✅ 사용자 정보 확인:", res.data);
        setCurrentUser(res.data);
      } catch (err) {
        console.warn("❌ 인증 실패:", err);
        localStorage.removeItem("accessToken");
        navigate("/");
      }
    };

    checkTokenAndFetchUser();
  }, [navigate]);

  // 로그아웃 핸들러
  const handleLogout = async () => {
    try {
      // 백엔드 로그아웃 API 호출
      await axios.post('/logout', {}, {
        withCredentials: true, // 쿠키 포함
      });
      
      // 클라이언트 측 토큰 제거
      localStorage.removeItem('accessToken');
      
      console.log('✅ 로그아웃 성공');
      
      // 로그인 페이지로 리다이렉트
      navigate('/');
    } catch (error) {
      console.error('❌ 로그아웃 실패:', error);
      // 에러가 발생해도 클라이언트 측 정리는 진행
      localStorage.removeItem('accessToken');
      navigate('/');
    }
  };

  // 캘린더 렌더링 함수
  const renderCalendar = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: React.ReactElement[] = [];
    
    // 빈 칸 추가
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-8"></div>
      );
    }
    
    // 날짜 추가
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = day === today.getDate();
      const hasEvent = day === 15 || day === 20 || day === 25;
      
      let className = "h-8 flex items-center justify-center text-sm cursor-pointer rounded transition-colors";
      
      if (isToday) {
        className += " bg-slate-700 text-white font-bold";
      } else if (hasEvent) {
        className += " bg-blue-100 text-blue-700 font-medium";
      } else {
        className += " hover:bg-slate-100";
      }
      
      days.push(
        <div
          key={`day-${day}`}
          className={className}
          onClick={() => setSelectedDate(new Date(currentYear, currentMonth, day))}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  // 로딩 중일 때
  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-slate-700">로딩 중...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* 헤더 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold text-slate-800">마이페이지</h1>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/main')}
                className="text-slate-600 hover:text-slate-800 transition-colors font-medium"
              >
                메인으로
              </button>
              {/* 로그아웃 이미지 아이콘 - 이 부분에 로그아웃 아이콘 이미지를 넣으시면 됩니다 */}
              <img
                src="/img/logout.png" // 여기에 로그아웃 아이콘 이미지 경로를 넣으세요
                alt="로그아웃"
                className="w-6 h-6 cursor-pointer hover:opacity-70 transition-opacity"
                onClick={handleLogout}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* 프로필 섹션 */}
        <div className="bg-white rounded-xl shadow-sm mb-8 overflow-hidden">
          <div className="h-24 bg-gradient-to-r from-slate-600 to-slate-700"></div>
          <div className="px-6 py-6">
            <div className="flex items-center gap-4 -mt-12">
              <div className="w-20 h-20 bg-white rounded-full border-4 border-white shadow-md flex items-center justify-center">
                <User className="w-10 h-10 text-slate-400" />
              </div>
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-slate-800">
                  {currentUser?.name || currentUser?.username || "사용자"}
                </h2>
                <div className="flex items-center gap-6 text-slate-600 mt-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>{currentUser?.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4" />
                    <span>회계팀</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2x2 그리드 레이아웃 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 1. 수행중인 프로젝트 */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-6">수행중인 프로젝트</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 border-l-4 border-blue-500 bg-blue-50 rounded-lg">
                <FileText className="w-5 h-5 text-blue-600" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-800">2024 상실회계서비스 재무제표</p>
                  <p className="text-xs text-slate-500">진행중 • 마감: 2025-08-15</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 border-l-4 border-orange-500 bg-orange-50 rounded-lg">
                <FileText className="w-5 h-5 text-orange-600" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-800">상실전자 증권신고서(지분증권)</p>
                  <p className="text-xs text-slate-500">진행중 • 마감: 2025-08-20</p>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t">
              <button 
                className="w-full text-center text-sm text-slate-600 hover:text-slate-800 transition-colors"
                onClick={() => navigate('/edit')}
              >
                전체 프로젝트 보기
              </button>
            </div>
          </div>

          {/* 2. 즐겨찾기 */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-6">즐겨찾기</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors">
                <FileText className="w-5 h-5 text-slate-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-800">증권 신고서 작성 요령 검토</p>
                  <p className="text-xs text-slate-500">지분증권</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors">
                <FileText className="w-5 h-5 text-slate-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-800">프로젝트 공유 드라이브</p>
                  <p className="text-xs text-slate-500">공유 문서</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors">
                <FileText className="w-5 h-5 text-slate-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-800">템플릿 모음</p>
                  <p className="text-xs text-slate-500">자주 사용</p>
                </div>
              </div>
            </div>
          </div>

          {/* 3. 사용자 설정 */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-6">사용자 설정</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors">
                <Settings className="w-5 h-5 text-slate-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-800">OPR 관리</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors">
                <Settings className="w-5 h-5 text-slate-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-800">WBS 관리</p>
                </div>
              </div>
            </div>
          </div>

          {/* 4. 캘린더 */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-slate-600" />
              캘린더
            </h3>
            <div className="mb-4">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium text-slate-700">
                  {selectedDate.getFullYear()}년 {selectedDate.getMonth() + 1}월
                </h4>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-xs text-slate-500 mb-3 font-medium">
                <div>일</div><div>월</div><div>화</div><div>수</div><div>목</div><div>금</div><div>토</div>
              </div>
              <div className="grid grid-cols-7 gap-1">
                {renderCalendar()}
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 pt-4 border-t">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-slate-700 rounded"></div>
                  <span>오늘</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-100 rounded border border-blue-200"></div>
                  <span>일정</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPage;