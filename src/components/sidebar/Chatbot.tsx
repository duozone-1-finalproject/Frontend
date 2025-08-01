import React, { useState } from 'react';
import ChatInput from './ChatInput';

interface Message {
  role: 'user' | 'bot';
  content: string;
}

const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'user', content: '안녕 챗봇아!' },
    { role: 'bot', content: '' },
    { role: 'user', content: '오늘 날씨 어때?' },
    { role: 'bot', content: '오늘은 맑고 기온은 28도입니다.' },
  ]);

  const handleSend = (msg: string) => {
    console.log('전송된 메시지:', msg);

    // 새 메시지를 추가
    setMessages((prev) => [...prev, { role: 'user', content: msg }]);

    // 챗봇 응답 더미
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: 'bot', content: '알겠습니다. 조금만 기다려 주세요.' }]);
    }, 1000);
  };

  return (
    <div className="sidebar flex flex-col overflow-y-auto justify-between h-full flex-1">
      <div className="sidebar-message overflow-y-auto p-4 flex-1">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`sidebar-message-content flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} mt-2 mb-3`}
          >
            <div className="sidebar-message-content-item bg-gray-300 text-gray-800 p-3 rounded-lg max-w-xs">
              {msg.content}
            </div>
          </div>
        ))}
      </div>
      <div className="sidebar-input p-2 border-t border-gray-600">
        <ChatInput onSend={handleSend} />
      </div>
    </div>
  );
};

export default Chatbot;
