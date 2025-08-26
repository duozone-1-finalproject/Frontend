// components/mypage/calendar/CalendarHeader.tsx
import React from 'react';
import { Calendar, ChevronLeft, ChevronRight, Plus } from 'lucide-react';

interface CalendarHeaderProps {
  currentMonth: Date;
  onMonthNavigate: (direction: 'prev' | 'next') => void;
  onEventAdd: () => void;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentMonth,
  onMonthNavigate,
  onEventAdd
}) => {
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-slate-600" />
          캘린더
        </h3>
        <button
          onClick={onEventAdd}
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
    </>
  );
};
