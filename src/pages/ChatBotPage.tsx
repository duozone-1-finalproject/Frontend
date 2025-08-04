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
import type { Message, Mode } from "../types/index"

export default function ChatBotPage() {
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
  })

  // Effects
  useEffect(() => {
    if (editor) {
      editor.setEditable(isEditing)
      if (isEditing && documentContent) {
        editor.commands.setContent(documentContent)
      }
    }
  }, [isEditing, editor])

  useEffect(() => {
    if (editor && isEditing && documentContent) {
      editor.commands.setContent(documentContent)
    }
  }, [editor, isEditing, documentContent])

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
        if (editor) {
          editor.commands.setContent(initialContent)
        }
        clearInterval(streamInterval)
      }
    }, 30)
  }

  const handleBackToChat = () => {
    setMode("chat")
    setStreamedContent("")
    setIsEditing(false)
  }

  const handleToggleEdit = () => {
    if (isEditing && editor) {
      setDocumentContent(editor.getHTML())
    } else {
      if (editor && documentContent) {
        editor.commands.setContent(documentContent)
      }
    }
    setIsEditing(!isEditing)
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
    />
  )
}
