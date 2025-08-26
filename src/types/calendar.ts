// types/calendar.ts (새로운 파일)
export interface CalendarEvent {
    id: string;
    title: string;
    date: string; // YYYY-MM-DD 형식
    time?: string; // HH:MM 형식 (선택사항)
    category: 'meeting' | 'deadline' | 'task' | 'personal';
    description?: string;
  }
  
  export interface Project {
    id: string;
    name: string;
    deadline: string;
    status: 'progress' | 'completed' | 'pending';
  }