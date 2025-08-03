import React, { useState } from 'react';
import ChatInput from './ChatInput';
import {useChat} from '../../context/chatContext/ChatContext';

const Chatbot = () => {
  const {messages, addMessage} = useChat();




  const handleSend = (msg: string) => {
    console.log('전송된 메시지:', msg);

    // 새 메시지를 추가
    addMessage({ role: 'user', content: msg });

    // 챗봇 응답 더미
    setTimeout(() => {
      addMessage({ role: 'bot', content: '알겠습니다. 조금만 기다려 주세요.' });
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
