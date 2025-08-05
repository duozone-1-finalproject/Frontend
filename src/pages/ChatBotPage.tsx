"use client"

import ChatInterface from "../components/chatbotpage/ChatInterface"
import DocumentEditor from "../components/chatbotpage/DocumentEditor"
import TemplateSelector from "../components/chatbotpage/TemplateSelector"
import { useSecuritiesChat } from "../hooks/chatbot/useSecuritiesChat"

export default function SecuritiesDocumentCreator() {
  const {
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
  } = useSecuritiesChat()

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

  if (mode === "template-select") {
    return (
      <TemplateSelector
        onSelectTemplate={selectedTemplate ? handleTemplateChange : handleTemplateSelect}
        onBack={handleBackToChat}
      />
    )
  }

  return (
    <DocumentEditor
      messages={messages}
      inputValue={inputValue}
      streamedContent={streamedContent}
      isStreaming={isStreaming}
      selectedTemplate={selectedTemplate}
      onInputChange={setInputValue}
      onSendMessage={handleSendMessage}
      onBackToChat={handleBackToChat}
      onBackToTemplateSelect={handleBackToTemplateSelect}
      onTemplateChange={handleTemplateChange}
    />
  )
}
