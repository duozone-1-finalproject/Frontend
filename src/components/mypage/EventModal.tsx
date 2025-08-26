// components/mypage/EventModal.tsx (새로운 컴포넌트)
import React, { useState } from 'react';
import { X } from 'lucide-react';

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time?: string;
  category: 'meeting' | 'deadline' | 'task' | 'personal';
  description?: string;
}

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Omit<CalendarEvent, 'id'>) => void;
  event?: CalendarEvent | null;
  date: string;
}

export const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, onSave, event, date }) => {
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
