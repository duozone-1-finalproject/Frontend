"use client"

import { useRef, useEffect } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Send } from "lucide-react"
import { MessageList } from "./MessageList"
import type { Message } from "../../types/index"

interface ChatInterfaceProps {
  messages: Message[]
  inputValue: string
  onInputChange: (value: string) => void
  onSendMessage: () => void
}

export function ChatInterface({ messages, inputValue, onInputChange, onSendMessage }: ChatInterfaceProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    <div className="flex h-screen bg-slate-800">
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 border-b border-slate-700 px-6 py-4">
          <h1 className="text-xl font-semibold text-white">증권신고서 작성 도우미</h1>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-800">
          <MessageList messages={messages} />
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="bg-slate-900 border-t border-slate-700 p-4">
          <div className="flex space-x-2">
            <Input
              value={inputValue}
              onChange={(e) => onInputChange(e.target.value)}
              placeholder="메시지를 입력하세요..."
              onKeyPress={(e) => e.key === "Enter" && onSendMessage()}
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
