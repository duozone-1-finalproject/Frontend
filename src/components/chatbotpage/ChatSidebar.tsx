"use client"

import type React from "react"

import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { MessageSquare, Clock, Send } from "lucide-react"
import type { Message } from "../../types/message"

interface ChatSidebarProps {
  messages: Message[]
  inputValue: string
  onInputChange: (value: string) => void
  onSendMessage: () => void
}

export default function ChatSidebar({ messages, inputValue, onInputChange, onSendMessage }: ChatSidebarProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSendMessage()
    }
  }

  return (
    <div className="w-80 bg-slate-800 text-white flex flex-col">
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center space-x-2">
          <MessageSquare className="w-5 h-5" />
          <Clock className="w-5 h-5" />
        </div>
      </div>
      <div className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
        {messages.slice(-10).map((message) => (
          <div key={message.id} className="mb-3">
            <div className="text-xs text-slate-400 mb-1">{message.isUser ? "나" : "AI"}</div>
            <div
              className={`text-sm p-2 rounded text-left line-clamp-3 ${
                message.isUser ? "bg-blue-500 text-white" : "bg-slate-700 text-white"
              }`}
              style={message.isUser ? { marginLeft: "auto", width: "fit-content", maxWidth: "85%" } : {}}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-slate-700">
        <div className="flex space-x-2">
          <Input
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder="무엇이든 물어보세요."
            onKeyPress={handleKeyPress}
            className="flex-1 bg-slate-700 border-slate-600 text-white placeholder-slate-400"
          />
          <Button onClick={onSendMessage} size="icon" variant="ghost" className="text-white hover:bg-slate-700">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
