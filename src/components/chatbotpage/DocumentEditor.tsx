"use client"

import { Button } from "../ui/button"
import { ArrowLeft, Edit3 } from "lucide-react"
import { ChatSidebar } from "./ChatSidebar"
import { DocumentContent } from "./DocumentContent"
import { SaveDropdown } from "./SaveDropdown"
import type { Message } from "../../types/index"
import type { Editor } from "@tiptap/react"

interface DocumentEditorProps {
  messages: Message[]
  inputValue: string
  onInputChange: (value: string) => void
  onSendMessage: () => void
  onBackToChat: () => void
  isEditing: boolean
  onToggleEdit: () => void
  isStreaming: boolean
  streamedContent: string
  documentContent: string
  editor: Editor | null
}

export function DocumentEditor({
  messages,
  inputValue,
  onInputChange,
  onSendMessage,
  onBackToChat,
  isEditing,
  onToggleEdit,
  isStreaming,
  streamedContent,
  documentContent,
  editor,
}: DocumentEditorProps) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Chat Sidebar */}
      <ChatSidebar
        messages={messages}
        inputValue={inputValue}
        onInputChange={onInputChange}
        onSendMessage={onSendMessage}
      />

      {/* Document Canvas */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Document Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={onBackToChat} className="flex items-center space-x-2">
              <ArrowLeft className="w-4 h-4" />
              <span>돌아가기</span>
            </Button>
            <h1 className="text-2xl font-bold text-center">증권신고서 자동 생성</h1>
          </div>
          <div className="flex items-center space-x-2">
            {!isEditing && <SaveDropdown documentContent={documentContent} />}
            <Button onClick={onToggleEdit} variant="outline" className="flex items-center space-x-2 bg-transparent">
              <Edit3 className="w-4 h-4" />
              <span>{isEditing ? "편집 완료" : "편집하기"}</span>
            </Button>
          </div>
        </div>

        {/* Document Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-8">
            <div className="bg-white">
              <DocumentContent
                isEditing={isEditing}
                isStreaming={isStreaming}
                streamedContent={streamedContent}
                documentContent={documentContent}
                editor={editor}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
