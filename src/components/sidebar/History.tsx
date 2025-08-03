import React from 'react';
import { useChat } from '../../context/chatContext/ChatContext';

const History = () => {
  const { messages } = useChat();

  return (
    <div className="sidebar flex flex-col h-full p-4 space-y-2 overflow-y-auto">
      {messages.map((msg, index) => (
        <div
          key={index}
          className="history-log bg-gray-300 text-gray-800 p-3 rounded-lg max-w-xs"
        >
          {msg.role === 'user' && (
            <p><strong>Q.</strong> {msg.content}</p>
          )}
          {msg.role === 'bot' && (
            <p><strong>A.</strong> {msg.content}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default History;