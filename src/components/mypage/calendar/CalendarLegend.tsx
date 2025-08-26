// components/mypage/calendar/CalendarLegend.tsx
import React from 'react';

export const CalendarLegend: React.FC = () => {
  return (
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
  );
};