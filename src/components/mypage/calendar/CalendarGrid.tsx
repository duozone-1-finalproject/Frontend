// components/mypage/calendar/CalendarGrid.tsx
import React from 'react';
import { CalendarDay } from './CalendarDay';


interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time?: string;
  category: 'meeting' | 'deadline' | 'task' | 'personal';
  description?: string;
}

interface Project {
  id: string;
  name: string;
  deadline: string;
  status: 'progress' | 'completed' | 'pending';
}

interface CalendarGridProps {
  currentMonth: Date;
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  getCategoryColor: (category: CalendarEvent['category']) => string;
  getEventsForDate: (date: Date) => CalendarEvent[];
  getProjectDeadlinesForDate: (date: Date) => Project[];
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  currentMonth,
  selectedDate,
  onDateSelect,
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
      
      days.push(
        <CalendarDay
          key={`day-${day}`}
          date={currentDate}
          today={today}
          selectedDate={selectedDate}
          events={getEventsForDate(currentDate)}
          deadlines={getProjectDeadlinesForDate(currentDate)}
          onDateSelect={onDateSelect}
          getCategoryColor={getCategoryColor}
        />
      );
    }

    return days;
  };

  return (
    <>
      <div className="grid grid-cols-7 gap-1 text-center text-xs text-slate-500 mb-3 font-medium">
        <div>일</div><div>월</div><div>화</div><div>수</div><div>목</div><div>금</div><div>토</div>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-4">
        {renderCalendar()}
      </div>
    </>
  );
};