"use client"

import { Button } from "../ui/button"
import { ArrowLeft, Edit3 } from "lucide-react"
import { ChatSidebar } from "./ChatSidebar"
import { DocumentContent } from "./DocumentContent"
import { SaveDropdown } from "./SaveDropdown"
import { VersionSelector } from "./VersionSelector"
import type { Message, DocumentVersion } from "../../types"
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
  versions: DocumentVersion[]
  currentVersionId: string | null
  onVersionSelect: (version: DocumentVersion) => void
  hasUnsavedChanges: boolean
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
  versions,
  currentVersionId,
  onVersionSelect,
  hasUnsavedChanges,
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
            <h1 className="text-lg font-medium">보고서 내용 편집</h1>
          </div>
          <div className="flex items-center space-x-3">
            {/* Version Selector */}
            <VersionSelector
              versions={versions}
              currentVersionId={currentVersionId}
              onVersionSelect={onVersionSelect}
              hasUnsavedChanges={hasUnsavedChanges}
            />

            {/* Save Dropdown - only show when not editing */}
            {!isEditing && <SaveDropdown documentContent={documentContent} />}

            {/* Edit Toggle Button */}
            <Button onClick={onToggleEdit} variant="outline" className="flex items-center space-x-2 bg-transparent">
              <Edit3 className="w-4 h-4" />
              <span>{isEditing ? "편집 완료" : "편집하기"}</span>
              {isEditing && hasUnsavedChanges && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />}
            </Button>
          </div>
        </div>

        {/* Document Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-8">
            <div className="bg-white">
              <h1 className="text-2xl font-bold text-center mb-8">증권신고서 자동 생성</h1>
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
