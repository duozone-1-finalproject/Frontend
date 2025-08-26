// components/mypage/MyPageSections.tsx (새로운 컴포넌트)
import React from 'react';
import { User, Mail, Building, FileText, Settings, Calendar, Plus, ChevronLeft, ChevronRight, Edit2, Trash2, X } from 'lucide-react';

interface UserDto {
  username: string;
  email: string;
  role: string;
  name?: string;
}

interface Project {
  id: string;
  name: string;
  deadline: string;
  status: 'progress' | 'completed' | 'pending';
}

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time?: string;
  category: 'meeting' | 'deadline' | 'task' | 'personal';
  description?: string;
}

interface MyPageHeaderProps {
  onBackToMain: () => void;
  onLogout: () => void;
}

export const MyPageHeader: React.FC<MyPageHeaderProps> = ({ onBackToMain, onLogout }) => (
  <div className="bg-white shadow-sm border-b">
    <div className="max-w-6xl mx-auto px-6 py-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-slate-800">마이페이지</h1>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={onBackToMain}
            className="text-slate-600 hover:text-slate-800 transition-colors font-medium"
          >
            메인으로
          </button>
          <img
            src="/img/logout.png"
            alt="로그아웃"
            className="w-6 h-6 cursor-pointer hover:opacity-70 transition-opacity"
            onClick={onLogout}
          />
        </div>
      </div>
    </div>
  </div>
);

interface ProfileSectionProps {
  user: UserDto;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({ user }) => (
  <div className="bg-white rounded-xl shadow-sm mb-8 overflow-hidden">
    <div className="h-24 bg-gradient-to-r from-slate-600 to-slate-700"></div>
    <div className="px-6 py-6">
      <div className="flex items-center gap-4 -mt-12">
        <div className="w-20 h-20 bg-white rounded-full border-4 border-white shadow-md flex items-center justify-center">
          <User className="w-10 h-10 text-slate-400" />
        </div>
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-slate-800">
            {user?.name || user?.username || "사용자"}
          </h2>
          <div className="flex items-center gap-6 text-slate-600 mt-2 text-sm">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span>{user?.email}</span>
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
);

interface ProjectsSectionProps {
  projects: Project[];
  onViewAll: () => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects, onViewAll }) => (
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
        onClick={onViewAll}
      >
        전체 프로젝트 보기
      </button>
    </div>
  </div>
);

export const FavoritesSection: React.FC = () => (
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
);

export const SettingsSection: React.FC = () => (
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
);

interface CalendarSectionProps {
  selectedDate: Date;
  currentMonth: Date;
  events: CalendarEvent[];
  projects: Project[];
  onDateSelect: (date: Date) => void;
  onMonthNavigate: (direction: 'prev' | 'next') => void;
  onEventAdd: (date?: Date) => void;
  onEventEdit: (date: Date, event: CalendarEvent) => void;
  onEventDelete: (eventId: string) => void;
  getCategoryColor: (category: CalendarEvent['category']) => string;
  getEventsForDate: (date: Date) => CalendarEvent[];
  getProjectDeadlinesForDate: (date: Date) => Project[];
}

export const CalendarSection: React.FC<CalendarSectionProps> = ({
  selectedDate,
  currentMonth,
  events,
  projects,
  onDateSelect,
  onMonthNavigate,
  onEventAdd,
  onEventEdit,
  onEventDelete,
  getCategoryColor,
  getEventsForDate,
  getProjectDeadlinesForDate
}) => {
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
          onClick={() => onDateSelect(currentDate)}
        >
          <span className={isToday ? "text-white" : "text-slate-800"}>{day}</span>
          
          <div className="flex gap-1 mt-1 flex-wrap">
            {dayEvents.slice(0, 2).map((event) => (
              <div
                key={event.id}
                className={`w-2 h-2 rounded-full ${getCategoryColor(event.category)}`}
                title={event.title}
              />
            ))}
            {dayDeadlines.slice(0, 2).map((project) => (
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

  const renderDayPreview = () => {
    const selectedEvents = getEventsForDate(selectedDate);
    const selectedDeadlines = getProjectDeadlinesForDate(selectedDate);
    
    if (selectedEvents.length === 0 && selectedDeadlines.length === 0) {
      return (
        <div className="text-center text-slate-500 py-4">
          <p>선택한 날짜에 일정이 없습니다.</p>
          <button
            onClick={() => onEventAdd(selectedDate)}
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
                onClick={() => onEventEdit(selectedDate, event)}
                className="p-1 hover:bg-blue-100 rounded text-blue-600"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onEventDelete(event.id)}
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

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-slate-600" />
          캘린더
        </h3>
        <button
          onClick={() => onEventAdd(selectedDate)}
          className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          일정 추가
        </button>
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => onMonthNavigate('prev')}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-slate-600" />
        </button>
        <h4 className="font-medium text-slate-700">
          {currentMonth.getFullYear()}년 {currentMonth.getMonth() + 1}월
        </h4>
        <button
          onClick={() => onMonthNavigate('next')}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-slate-600" />
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 text-center text-xs text-slate-500 mb-3 font-medium">
        <div>일</div><div>월</div><div>화</div><div>수</div><div>목</div><div>금</div><div>토</div>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-4">
        {renderCalendar()}
      </div>
      
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
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>사용자 일정</span>
          </div>
        </div>
      </div>
      
      <div className="mt-4">
        <h5 className="font-medium text-slate-700 mb-3">
          {selectedDate.getMonth() + 1}월 {selectedDate.getDate()}일 일정
        </h5>
        {renderDayPreview()}
      </div>
    </div>
  );
};