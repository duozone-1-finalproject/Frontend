// src/hooks/pages/useMyPage.ts
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import type { UserDto } from '../../types/auth';
import type { CalendarEvent, Project } from '../../types/calendar';

export const useMyPage = () => {
  const navigate = useNavigate();
  
  // 상태 관리
  const [currentUser, setCurrentUser] = useState<UserDto | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [modalDate, setModalDate] = useState<string>('');

  // 고정된 프로젝트 데이터 (추후 API로 대체 가능)
  const projects: Project[] = [
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
  ];

  // 컴포넌트 초기화
  useEffect(() => {
    const checkTokenAndFetchUser = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/");
      return;
    }

      try {
        const res = await axios.get<UserDto>("/users/me");
        setCurrentUser(res.data);
      } catch (err) {
        console.error('Failed to fetch user data:', err);
        localStorage.removeItem("accessToken");
        navigate("/");
      }
    };

    // 초기 일정 데이터 설정
    const initializeEvents = () => {
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
    };

    checkTokenAndFetchUser();
    initializeEvents();
  }, [navigate]);

  // 로그아웃 처리
  const handleLogout = async () => {
    try {
      await axios.post('/logout', {}, { withCredentials: true });
      localStorage.removeItem('accessToken');
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      localStorage.removeItem('accessToken');
      navigate('/');
    }
  };

  // 캘린더 월 이동
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

  // 특정 날짜의 프로젝트 데드라인 가져오기
  const getProjectDeadlinesForDate = (date: Date): Project[] => {
    const dateString = date.toISOString().split('T')[0];
    return projects.filter(project => project.deadline === dateString);
  };

  // 카테고리별 색상 지정
  const getCategoryColor = (category: CalendarEvent['category']) => {
    switch (category) {
      case 'meeting': return 'bg-blue-500';
      case 'deadline': return 'bg-red-500';
      case 'task': return 'bg-green-500';
      case 'personal': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  // 이벤트 모달 열기
  const openEventModal = (date?: Date, event?: CalendarEvent) => {
    const targetDate = date || selectedDate;
    setModalDate(targetDate.toISOString().split('T')[0]);
    setEditingEvent(event || null);
    setShowEventModal(true);
  };

  // 이벤트 저장
  const saveEvent = (eventData: Omit<CalendarEvent, 'id'>) => {
    if (editingEvent) {
      // 기존 이벤트 수정
      setEvents(prev => prev.map(event => 
        event.id === editingEvent.id 
          ? { ...eventData, id: editingEvent.id }
          : event
      ));
    } else {
      // 새 이벤트 추가
      const newEvent: CalendarEvent = {
        ...eventData,
        id: Date.now().toString()
      };
      setEvents(prev => [...prev, newEvent]);
    }
    
    setShowEventModal(false);
    setEditingEvent(null);
  };

  // 이벤트 삭제
  const deleteEvent = (eventId: string) => {
    setEvents(prev => prev.filter(event => event.id !== eventId));
  };

  return {
    // 상태
    currentUser,
    selectedDate,
    currentMonth,
    events,
    projects,
    showEventModal,
    editingEvent,
    modalDate,
    
    // 상태 변경 함수
    setSelectedDate,
    setShowEventModal,
    setEditingEvent,
    
    // 액션 함수
    handleLogout,
    navigateMonth,
    openEventModal,
    saveEvent,
    deleteEvent,
    
    // 유틸리티 함수
    getEventsForDate,
    getProjectDeadlinesForDate,
    getCategoryColor,
    
    // 네비게이션
    navigate
  };
};