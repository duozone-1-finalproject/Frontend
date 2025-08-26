// src/hooks/common/useCalendar.ts
import { useState, useCallback } from 'react';
import type { CalendarEvent } from '../../types/calendar';

export const useCalendar = (initialEvents: CalendarEvent[] = []) => {
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  // 이벤트 추가
  const addEvent = useCallback((eventData: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...eventData,
      id: Date.now().toString(),
    };
    setEvents(prev => [...prev, newEvent]);
    return newEvent;
  }, []);

  // 이벤트 수정
  const updateEvent = useCallback((eventId: string, eventData: Partial<CalendarEvent>) => {
    setEvents(prev =>
      prev.map(event =>
        event.id === eventId ? { ...event, ...eventData } : event
      )
    );
  }, []);

  // 이벤트 삭제
  const deleteEvent = useCallback((eventId: string) => {
    setEvents(prev => prev.filter(event => event.id !== eventId));
  }, []);

  // 특정 날짜의 이벤트 가져오기
  const getEventsForDate = useCallback((date: Date): CalendarEvent[] => {
    const dateString = date.toISOString().split('T')[0];
    return events.filter(event => event.date === dateString);
  }, [events]);

  // 월 이동
  const navigateMonth = useCallback((direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      return newDate;
    });
  }, []);

  // 오늘로 이동
  const goToToday = useCallback(() => {
    const today = new Date();
    setCurrentMonth(today);
    setSelectedDate(today);
  }, []);

  // 카테고리별 이벤트 필터링
  const getEventsByCategory = useCallback((category: CalendarEvent['category']) => {
    return events.filter(event => event.category === category);
  }, [events]);

  // 캘린더 렌더링을 위한 날짜 배열 생성
  const getCalendarDays = useCallback(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];

    // 빈 칸 추가 (이전 달)
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // 현재 달의 날짜들 추가
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  }, [currentMonth]);

  return {
    // 상태
    events,
    selectedDate,
    currentMonth,
    
    // 이벤트 관리
    addEvent,
    updateEvent,
    deleteEvent,
    
    // 유틸리티
    getEventsForDate,
    getEventsByCategory,
    getCalendarDays,
    
    // 네비게이션
    navigateMonth,
    goToToday,
    setSelectedDate,
  };
};