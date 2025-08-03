import React, { createContext, useContext, useState } from 'react';

interface Message {
  role: 'user' | 'bot';
  content: string;
}

interface ChatContextType {
  messages: Message[];
  addMessage: (msg: Message) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'user', content: '안녕 챗봇아!' },
    { role: 'bot', content: '' },
    { role: 'user', content: '오늘 날씨 어때?' },
    { role: 'bot', content: '오늘은 맑고 기온은 28도입니다.' },
  ]);

  const addMessage = (msg: Message) => {
    setMessages((prev) => [...prev, msg]);
  };

  return (
    <ChatContext.Provider value={{ messages, addMessage }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useChat must be used within a ChatProvider');
  return context;
};
