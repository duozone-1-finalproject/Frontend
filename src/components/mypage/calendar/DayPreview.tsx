// components/mypage/calendar/DayPreview.tsx
import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';

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

interface DayPreviewProps {
  selectedDate: Date;
  events: CalendarEvent[];
  deadlines: Project[];
  getCategoryColor: (category: CalendarEvent['category']) => string;
  onEventAdd: (date: Date) => void;
  onEventEdit: (date: Date, event: CalendarEvent) => void;
  onEventDelete: (eventId: string) => void;
}

export const DayPreview: React.FC<DayPreviewProps> = ({
  selectedDate,
  events,
  deadlines,
  getCategoryColor,
  onEventAdd,
  onEventEdit,
  onEventDelete
}) => {
  if (events.length === 0 && deadlines.length === 0) {
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
      {deadlines.map(project => (
        <div key={project.id} className="flex items-center gap-3 p-3 bg-red-50 border-l-4 border-red-500 rounded-lg">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-800">📋 {project.name}</p>
            <p className="text-xs text-red-600">프로젝트 마감일</p>
          </div>
        </div>
      ))}
      
      {events.map(event => (
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