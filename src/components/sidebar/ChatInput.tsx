import React, { useState, KeyboardEvent } from 'react';

interface ChatInputProps {
  onSend: (message: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend }) => {
  const [message, setMessage] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // 기본 줄바꿈 방지
      const trimmed = message.trim();
      if (trimmed) {
        onSend(trimmed);
        setMessage('');
      }
    } else if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault(); // Alt+Enter 시 줄바꿈 삽입
      setMessage((prev) => prev + '\n');
    }
  };

  return (
    <div className="sidebar-input mt-auto">
      <textarea
        placeholder="무엇이든 물어보세요."
        className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white placeholder-gray-400 resize-none"
        rows={3}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};

export default ChatInput;
