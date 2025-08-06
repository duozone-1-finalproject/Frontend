// src/pages/MyPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Settings, User, Mail, Building, Clock, FileText, ChevronLeft, ChevronRight, Plus, Edit2, Trash2, X } from 'lucide-react';
import axios from '../api/axios';

// 사용자 정보 인터페이스
interface UserDto {
  username: string;
  email: string;
  role: string;
  name?: string;
}

// 일정 인터페이스
interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD 형식
  time?: string; // HH:MM 형식 (선택사항)
  category: 'meeting' | 'deadline' | 'task' | 'personal';
  description?: string;
}

// 프로젝트 인터페이스
interface Project {
  id: string;
  name: string;
  deadline: string;
  status: 'progress' | 'completed' | 'pending';
}

const MyPage = () => {
  const navigate = useNavigate();
  
  const [currentUser, setCurrentUser] = useState<UserDto | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [projects] = useState<Project[]>([
    {
      id: '1',
      name: '2024 상실회계서비스 재무제표',
      deadline: '2025-08-15',
      status: 'progress'
    },
    {
      id: '2', 
      name: '상실전자 증권신고서(지분증권)',
      deadline: '2025-08-20',
      status: 'progress'
    },
    {
      id: '3',
      name: 'Q2 결산 보고서',
      deadline: '2025-08-25',
      status: 'pending'
    }
  ]);
  
  // 모달 상태
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [modalDate, setModalDate] = useState<string>('');

  // JWT 검증 및 사용자 정보 가져오기
  useEffect(() => {
    const checkTokenAndFetchUser = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        navigate("/");
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
    
    // 초기 일정 데이터 (실제로는 API에서 가져와야 함)
    setEvents([
      {
        id: '1',
        title: '팀 미팅',
        date: '2025-08-08',
        time: '09:00',
        category: 'meeting',
        description: '주간 팀 미팅'
      },
      {
        id: '2',
        title: '프로젝트 검토',
        date: '2025-08-12',
        time: '14:00',
        category: 'task',
        description: '진행 상황 점검'
      }
    ]);
  }, [navigate]);

  // 로그아웃 핸들러
  const handleLogout = async () => {
    try {
      await axios.post('/logout', {}, {
        withCredentials: true,
      });
      localStorage.removeItem('accessToken');
      console.log('✅ 로그아웃 성공');
      navigate('/');
    } catch (error) {
      console.error('❌ 로그아웃 실패:', error);
      localStorage.removeItem('accessToken');
      navigate('/');
    }
  };

  // 이전/다음 달 네비게이션
  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      return newDate;
    });
  };

  // 특정 날짜의 이벤트 가져오기
  const getEventsForDate = (date: Date): CalendarEvent[] => {
    const dateString = date.toISOString().split('T')[0];
    return events.filter(event => event.date === dateString);
  };

  // 특정 날짜의 프로젝트 마감일 가져오기
  const getProjectDeadlinesForDate = (date: Date): Project[] => {
    const dateString = date.toISOString().split('T')[0];
    return projects.filter(project => project.deadline === dateString);
  };

  // 카테고리별 색상 반환
  const getCategoryColor = (category: CalendarEvent['category']) => {
    switch (category) {
      case 'meeting': return 'bg-blue-500';
      case 'deadline': return 'bg-red-500';
      case 'task': return 'bg-green-500';
      case 'personal': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  // 일정 추가/수정 모달 열기
  const openEventModal = (date?: Date, event?: CalendarEvent) => {
    const targetDate = date || selectedDate;
    setModalDate(targetDate.toISOString().split('T')[0]);
    setEditingEvent(event || null);
    setShowEventModal(true);
  };

  // 일정 저장
  const saveEvent = (eventData: Omit<CalendarEvent, 'id'>) => {
    if (editingEvent) {
      // 수정
      setEvents(prev => prev.map(event => 
        event.id === editingEvent.id 
          ? { ...eventData, id: editingEvent.id }
          : event
      ));
    } else {
      // 새로 추가
      const newEvent: CalendarEvent = {
        ...eventData,
        id: Date.now().toString()
      };
      setEvents(prev => [...prev, newEvent]);
    }
    setShowEventModal(false);
    setEditingEvent(null);
  };

  // 일정 삭제
  const deleteEvent = (eventId: string) => {
    setEvents(prev => prev.filter(event => event.id !== eventId));
  };

  // 캘린더 렌더링
  const renderCalendar = () => {
    const today = new Date();
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: React.ReactElement[] = [];
    
    // 빈 칸 추가
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="h-12"></div>);
    }
    
    // 날짜 추가
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day);
      const isToday = currentDate.toDateString() === today.toDateString();
      const isSelected = currentDate.toDateString() === selectedDate.toDateString();
      const dayEvents = getEventsForDate(currentDate);
      const dayDeadlines = getProjectDeadlinesForDate(currentDate);
      
      let className = "h-12 flex flex-col items-center justify-start text-sm cursor-pointer rounded transition-colors p-1 relative";
      
      if (isToday) {
        className += " bg-slate-700 text-white font-bold";
      } else if (isSelected) {
        className += " bg-blue-100 border-2 border-blue-300";
      } else {
        className += " hover:bg-slate-100";
      }
      
      days.push(
        <div
          key={`day-${day}`}
          className={className}
          onClick={() => setSelectedDate(currentDate)}
        >
          <span className={isToday ? "text-white" : "text-slate-800"}>{day}</span>
          
          {/* 이벤트 표시 도트 */}
          <div className="flex gap-1 mt-1 flex-wrap">
            {dayEvents.slice(0, 2).map((event, index) => (
              <div
                key={event.id}
                className={`w-2 h-2 rounded-full ${getCategoryColor(event.category)}`}
                title={event.title}
              />
            ))}
            {dayDeadlines.slice(0, 2).map((project, index) => (
              <div
                key={project.id}
                className="w-2 h-2 rounded-full bg-red-500"
                title={`마감: ${project.name}`}
              />
            ))}
            {(dayEvents.length + dayDeadlines.length) > 2 && (
              <div className="text-xs text-slate-500">+{(dayEvents.length + dayDeadlines.length) - 2}</div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  // 선택된 날짜의 일정 미리보기
  const renderDayPreview = () => {
    const selectedEvents = getEventsForDate(selectedDate);
    const selectedDeadlines = getProjectDeadlinesForDate(selectedDate);
    
    if (selectedEvents.length === 0 && selectedDeadlines.length === 0) {
      return (
        <div className="text-center text-slate-500 py-4">
          <p>선택한 날짜에 일정이 없습니다.</p>
          <button
            onClick={() => openEventModal(selectedDate)}
            className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
          >
            일정 추가하기
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {selectedDeadlines.map(project => (
          <div key={project.id} className="flex items-center gap-3 p-3 bg-red-50 border-l-4 border-red-500 rounded-lg">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-800">📋 {project.name}</p>
              <p className="text-xs text-red-600">프로젝트 마감일</p>
            </div>
          </div>
        ))}
        
        {selectedEvents.map(event => (
          <div key={event.id} className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg group">
            <div className={`w-3 h-3 rounded-full ${getCategoryColor(event.category)}`}></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-800">
                {event.time && `${event.time} - `}{event.title}
              </p>
              {event.description && (
                <p className="text-xs text-slate-500">{event.description}</p>
              )}
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
              <button
                onClick={() => openEventModal(selectedDate, event)}
                className="p-1 hover:bg-blue-100 rounded text-blue-600"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => deleteEvent(event.id)}
                className="p-1 hover:bg-red-100 rounded text-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    );
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
              <img
                src="/img/logout.png"
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
              {projects.map(project => (
                <div key={project.id} className="flex items-center gap-3 p-4 border-l-4 border-blue-500 bg-blue-50 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-800">{project.name}</p>
                    <p className="text-xs text-slate-500">진행중 • 마감: {project.deadline}</p>
                  </div>
                </div>
              ))}
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
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-slate-600" />
                캘린더
              </h3>
              <button
                onClick={() => openEventModal(selectedDate)}
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                일정 추가
              </button>
            </div>
            
            {/* 월 네비게이션 */}
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-slate-600" />
              </button>
              <h4 className="font-medium text-slate-700">
                {currentMonth.getFullYear()}년 {currentMonth.getMonth() + 1}월
              </h4>
              <button
                onClick={() => navigateMonth('next')}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-slate-600" />
              </button>
            </div>
            
            {/* 캘린더 그리드 */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs text-slate-500 mb-3 font-medium">
              <div>일</div><div>월</div><div>화</div><div>수</div><div>목</div><div>금</div><div>토</div>
            </div>
            <div className="grid grid-cols-7 gap-1 mb-4">
              {renderCalendar()}
            </div>
            
            {/* 범례 */}
            <div className="flex items-center justify-between text-xs text-slate-500 py-3 border-t border-b">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-slate-700 rounded"></div>
                  <span>오늘</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span>미팅</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span>마감일</span>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span>사용자 일정</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 선택된 날짜의 일정 미리보기 */}
            <div className="mt-4">
              <h5 className="font-medium text-slate-700 mb-3">
                {selectedDate.getMonth() + 1}월 {selectedDate.getDate()}일 일정
              </h5>
              {renderDayPreview()}
            </div>
          </div>
        </div>
      </div>

      {/* 일정 추가/수정 모달 */}
      {showEventModal && (
        <EventModal
          isOpen={showEventModal}
          onClose={() => {
            setShowEventModal(false);
            setEditingEvent(null);
          }}
          onSave={saveEvent}
          event={editingEvent}
          date={modalDate}
        />
      )}
    </div>
  );
};

// 일정 추가/수정 모달 컴포넌트
interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Omit<CalendarEvent, 'id'>) => void;
  event?: CalendarEvent | null;
  date: string;
}

const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, onSave, event, date }) => {
  const [title, setTitle] = useState(event?.title || '');
  const [time, setTime] = useState(event?.time || '');
  const [category, setCategory] = useState<CalendarEvent['category']>(event?.category || 'task');
  const [description, setDescription] = useState(event?.description || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      title: title.trim(),
      date,
      time: time || undefined,
      category,
      description: description.trim() || undefined,
    });

    // 폼 초기화
    setTitle('');
    setTime('');
    setCategory('task');
    setDescription('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-slate-800">
            {event ? '일정 수정' : '일정 추가'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              일정 제목 *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="일정 제목을 입력하세요"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              날짜
            </label>
            <input
              type="date"
              value={date}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50"
              disabled
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              시간 (선택사항)
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              카테고리
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as CalendarEvent['category'])}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="task">업무</option>
              <option value="meeting">미팅</option>
              <option value="deadline">마감일</option>
              <option value="personal">개인</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              설명 (선택사항)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="일정에 대한 추가 설명을 입력하세요"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {event ? '수정' : '추가'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MyPage;