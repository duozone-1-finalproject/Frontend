// components/mypage/calendar/CalendarDay.tsx
import React from 'react';

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

interface CalendarDayProps {
  date: Date;
  today: Date;
  selectedDate: Date;
  events: CalendarEvent[];
  deadlines: Project[];
  onDateSelect: (date: Date) => void;
  getCategoryColor: (category: CalendarEvent['category']) => string;
}

export const CalendarDay: React.FC<CalendarDayProps> = ({
  date,
  today,
  selectedDate,
  events,
  deadlines,
  onDateSelect,
  getCategoryColor
}) => {
  const day = date.getDate();
  const isToday = date.toDateString() === today.toDateString();
  const isSelected = date.toDateString() === selectedDate.toDateString();
  
  let className = "h-12 flex flex-col items-center justify-start text-sm cursor-pointer rounded transition-colors p-1 relative";
  
  if (isToday) {
    className += " bg-slate-700 text-white font-bold";
  } else if (isSelected) {
    className += " bg-blue-100 border-2 border-blue-300";
  } else {
    className += " hover:bg-slate-100";
  }

  return (
    <div
      className={className}
      onClick={() => onDateSelect(date)}
    >
      <span className={isToday ? "text-white" : "text-slate-800"}>{day}</span>
      
      <div className="flex gap-1 mt-1 flex-wrap">
        {events.slice(0, 2).map((event) => (
          <div
            key={event.id}
            className={`w-2 h-2 rounded-full ${getCategoryColor(event.category)}`}
            title={event.title}
          />
        ))}
        {deadlines.slice(0, 2).map((project) => (
          <div
            key={project.id}
            className="w-2 h-2 rounded-full bg-red-500"
            title={`마감: ${project.name}`}
          />
        ))}
        {(events.length + deadlines.length) > 2 && (
          <div className="text-xs text-slate-500">+{(events.length + deadlines.length) - 2}</div>
        )}
      </div>
    </div>
  );
};