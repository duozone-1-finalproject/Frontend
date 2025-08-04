"use client"

import { useState, useEffect } from "react"
import { useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { Color } from "@tiptap/extension-color"
import { TextStyle } from "@tiptap/extension-text-style"
import { Highlight } from "@tiptap/extension-highlight"
import { TextAlign } from "@tiptap/extension-text-align"
import { Table } from "@tiptap/extension-table"
import { TableRow } from "@tiptap/extension-table-row"
import { TableHeader } from "@tiptap/extension-table-header"
import { TableCell } from "@tiptap/extension-table-cell"

import { ChatInterface } from "../components/chatbotpage/ChatInterface"
import { DocumentEditor } from "../components/chatbotpage/DocumentEditor"
import { getInitialDocumentHTML, getStreamingContent } from "../utils/documentUtils"
import { createNewVersion, saveVersionsToStorage, loadVersionsFromStorage } from "../utils/versionUtils"
import type { Message, Mode, DocumentVersion } from "../types"

export default function SecuritiesDocumentCreator() {
  // State
  const [mode, setMode] = useState<Mode>("chat")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "안녕하세요! 증권신고서 작성을 도와드리겠습니다. 어떤 도움이 필요하신가요?",
      isUser: false,
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamedContent, setStreamedContent] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [documentContent, setDocumentContent] = useState("")

  // Version Management State
  const [versions, setVersions] = useState<DocumentVersion[]>([])
  const [currentVersionId, setCurrentVersionId] = useState<string | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [lastSavedContent, setLastSavedContent] = useState("")

  // Tiptap Editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color.configure({ types: ["textStyle"] }),
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: "",
    editable: isEditing,
    onUpdate: ({ editor }) => {
      const currentContent = editor.getHTML()
      setHasUnsavedChanges(currentContent !== lastSavedContent)
    },
  })

  // Load versions from localStorage on mount
  useEffect(() => {
    const savedVersions = loadVersionsFromStorage()
    setVersions(savedVersions)

    // Set the latest version as current if exists
    if (savedVersions.length > 0) {
      const latestVersion = savedVersions.reduce((latest, current) =>
        current.version > latest.version ? current : latest,
      )
      setCurrentVersionId(latestVersion.id)
      setDocumentContent(latestVersion.content)
      setLastSavedContent(latestVersion.content)
    }
  }, [])

  // Save versions to localStorage whenever versions change
  useEffect(() => {
    if (versions.length > 0) {
      saveVersionsToStorage(versions)
    }
  }, [versions])

  // Effects
  useEffect(() => {
    if (editor) {
      editor.setEditable(isEditing)
    }
  }, [isEditing, editor])

  // Check for unsaved changes when document content changes
  useEffect(() => {
    setHasUnsavedChanges(documentContent !== lastSavedContent)
  }, [documentContent, lastSavedContent])

  // Handlers
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      isUser: true,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, newMessage])
    setInputValue("")

    if (inputValue.includes("증권신고서") || inputValue.includes("신고서")) {
      setTimeout(() => {
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          content: "증권신고서를 작성해드리겠습니다. 잠시만 기다려주세요.",
          isUser: false,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, botResponse])

        setTimeout(() => {
          setMode("document")
          startDocumentStreaming()
        }, 1000)
      }, 500)
    } else {
      setTimeout(() => {
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          content: "네, 이해했습니다. 증권신고서 작성이 필요하시면 말씀해 주세요.",
          isUser: false,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, botResponse])
      }, 1000)
    }
  }

  const startDocumentStreaming = () => {
    setIsStreaming(true)
    const fullContent = getStreamingContent()

    let index = 0
    const streamInterval = setInterval(() => {
      if (index < fullContent.length) {
        setStreamedContent(fullContent.slice(0, index + 1))
        index++
      } else {
        setIsStreaming(false)
        const initialContent = getInitialDocumentHTML()
        setDocumentContent(initialContent)

        // Create first version automatically
        if (versions.length === 0) {
          const firstVersion = createNewVersion(initialContent, versions, "초기 증권신고서", "AI가 생성한 초기 문서")
          setVersions([firstVersion])
          setCurrentVersionId(firstVersion.id)
          setLastSavedContent(initialContent)
          setHasUnsavedChanges(false)
        }

        clearInterval(streamInterval)
      }
    }, 20)
  }

  const handleBackToChat = () => {
    setMode("chat")
    setStreamedContent("")
    setIsEditing(false)
  }

  const handleToggleEdit = () => {
    if (isEditing && editor) {
      // 편집 완료 시: 자동으로 새 버전 생성
      const currentHTML = editor.getHTML()
      console.log("Saving editor content:", currentHTML)

      // 내용이 변경되었을 때만 새 버전 생성
      if (currentHTML !== lastSavedContent) {
        const newVersion = createNewVersion(
          currentHTML,
          versions,
          `증권신고서 v${versions.length + 1}`,
          `버전 ${versions.length + 1} - ${new Date().toLocaleString("ko-KR")}`,
        )

        setVersions((prev) => [...prev, newVersion])
        setCurrentVersionId(newVersion.id)
        setLastSavedContent(currentHTML)
        setHasUnsavedChanges(false)

        console.log("New version created automatically:", newVersion)
      }

      // 에디터 내용을 문서 내용으로 설정
      setDocumentContent(currentHTML)
    } else {
      // 편집 시작 시: 현재 문서 내용을 에디터에 로드
      if (editor) {
        const contentToEdit = documentContent || getInitialDocumentHTML()
        console.log("Loading content to editor:", contentToEdit)
        editor.commands.setContent(contentToEdit)
        setLastSavedContent(contentToEdit)
      }
    }
    setIsEditing(!isEditing)
  }

  // Version Management Handlers
  const handleVersionSelect = (version: DocumentVersion) => {
    if (hasUnsavedChanges) {
      const confirmSwitch = window.confirm("저장되지 않은 변경사항이 있습니다. 다른 버전으로 이동하시겠습니까?")
      if (!confirmSwitch) return
    }

    setCurrentVersionId(version.id)
    setDocumentContent(version.content)
    setLastSavedContent(version.content)
    setHasUnsavedChanges(false)

    // 편집 모드였다면 에디터 내용도 업데이트
    if (isEditing && editor) {
      editor.commands.setContent(version.content)
    }

    console.log("Switched to version:", version.version)
  }

  // Render
  if (mode === "chat") {
    return (
      <ChatInterface
        messages={messages}
        inputValue={inputValue}
        onInputChange={setInputValue}
        onSendMessage={handleSendMessage}
      />
    )
  }

  return (
    <DocumentEditor
      messages={messages}
      inputValue={inputValue}
      onInputChange={setInputValue}
      onSendMessage={handleSendMessage}
      onBackToChat={handleBackToChat}
      isEditing={isEditing}
      onToggleEdit={handleToggleEdit}
      isStreaming={isStreaming}
      streamedContent={streamedContent}
      documentContent={documentContent}
      editor={editor}
      versions={versions}
      currentVersionId={currentVersionId}
      onVersionSelect={handleVersionSelect}
      hasUnsavedChanges={hasUnsavedChanges}
    />
  )
}
