"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Send } from "lucide-react"
import type { Message } from "../../types/message"

interface ChatInterfaceProps {
  messages: Message[]
  inputValue: string
  onInputChange: (value: string) => void
  onSendMessage: () => void
}

export default function ChatInterface({ messages, inputValue, onInputChange, onSendMessage }: ChatInterfaceProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSendMessage()
    }
  }

  return (
    <div className="flex h-screen bg-slate-800">
      <div className="flex-1 flex flex-col">
        <div className="bg-slate-900 border-b border-slate-700 px-6 py-4">
          <h1 className="text-xl font-semibold text-white">증권신고서 작성 도우미</h1>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-800">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.isUser ? "bg-blue-500 text-white" : "bg-slate-700 text-white border-slate-600"
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className="text-xs mt-1 opacity-70">
                  {message.timestamp.toLocaleTimeString("ko-KR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="bg-slate-900 border-t border-slate-700 p-4">
          <div className="flex space-x-2">
            <Input
              value={inputValue}
              onChange={(e) => onInputChange(e.target.value)}
              placeholder="메시지를 입력하세요..."
              onKeyPress={handleKeyPress}
              className="flex-1 bg-slate-700 border-slate-600 text-white placeholder-slate-400"
            />
            <Button onClick={onSendMessage} size="icon">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
