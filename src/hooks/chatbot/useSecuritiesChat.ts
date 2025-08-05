"use client"

import { useState } from "react"
import type { Message } from "../../types/message"
import type { DocumentTemplate } from "../../utils/documentTemplates"
import { splitHTMLIntoChunks } from "../../utils/htmlStreaming"

export function useSecuritiesChat() {
  const [mode, setMode] = useState<"chat" | "template-select" | "document">("chat")
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
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null)

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
          content: "증권신고서 작성을 도와드리겠습니다. 먼저 적합한 템플릿을 선택해주세요.",
          isUser: false,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, botResponse])

        setTimeout(() => {
          setMode("template-select")
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

  const handleTemplateSelect = (template: DocumentTemplate) => {
    setSelectedTemplate(template)

    // 템플릿 선택 메시지 추가
    const templateMessage: Message = {
      id: Date.now().toString(),
      content: `"${template.name}" 템플릿을 선택하셨습니다. AI가 전문적인 증권신고서를 생성하고 있습니다...`,
      isUser: false,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, templateMessage])

    // 즉시 로딩 상태로 시작
    setIsStreaming(true)
    setStreamedContent("")
    setMode("document")

    // 스트리밍 시작 (약간의 지연 후)
    setTimeout(() => {
      startHTMLStreaming(template)
    }, 1000)
  }

  const handleTemplateChange = (template: DocumentTemplate) => {
    setSelectedTemplate(template)

    // 템플릿 변경 시 즉시 로딩 상태로 초기화
    setIsStreaming(true)
    setStreamedContent("")
    setMode("document")

    // 템플릿 변경 메시지 추가
    const templateMessage: Message = {
      id: Date.now().toString(),
      content: `템플릿을 "${template.name}"으로 변경했습니다. 새로운 증권신고서를 생성하고 있습니다...`,
      isUser: false,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, templateMessage])

    // 스트리밍 시작
    setTimeout(() => {
      startHTMLStreaming(template)
    }, 1000)
  }

  const startHTMLStreaming = (template: DocumentTemplate) => {
    // 이미 스트리밍 상태이므로 상태 변경 불필요

    // 선택된 템플릿의 HTML 생성
    const fullHTML = template.htmlContent()

    // HTML을 더 작은 청크로 분할하여 더 세밀한 스트리밍 효과
    const chunks = splitHTMLIntoChunks(fullHTML, 15)

    let currentChunkIndex = 0
    let accumulatedHTML = ""

    const streamInterval = setInterval(() => {
      if (currentChunkIndex < chunks.length) {
        accumulatedHTML += chunks[currentChunkIndex]
        setStreamedContent(accumulatedHTML)
        currentChunkIndex++
      } else {
        // 스트리밍 완료
        setIsStreaming(false)
        clearInterval(streamInterval)

        // 완료 메시지 추가
        setTimeout(() => {
          const completionMessage: Message = {
            id: Date.now().toString(),
            content: `✅ ${template.name} 생성이 완료되었습니다! 이제 문서를 편집하거나 저장할 수 있습니다.`,
            isUser: false,
            timestamp: new Date(),
          }
          setMessages((prev) => [...prev, completionMessage])
        }, 500)
      }
    }, 80) // 80ms 간격으로 더 부드러운 스트리밍
  }

  const handleBackToChat = () => {
    setMode("chat")
    setStreamedContent("")
    setSelectedTemplate(null)
    setIsStreaming(false)
  }

  const handleBackToTemplateSelect = () => {
    setMode("template-select")
    setIsStreaming(false)
    setStreamedContent("")
  }

  return {
    mode,
    messages,
    inputValue,
    isStreaming,
    streamedContent,
    selectedTemplate,
    setInputValue,
    handleSendMessage,
    handleTemplateSelect,
    handleTemplateChange,
    handleBackToChat,
    handleBackToTemplateSelect,
  }
}
