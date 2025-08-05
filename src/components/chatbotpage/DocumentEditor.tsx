"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "../ui/button"
import { ArrowLeft, Edit3 } from "lucide-react"
import ChatSidebar from "./ChatSidebar"
import EditorToolbar from "./EditorToolbar"
import DocumentGenerationLoader from "./DocumentGenerationLoader"
import type { Message } from "../../types/message"
import type { DocumentTemplate } from "../../utils/documentTemplates"
import SaveDropdown from "./SaveDropdown"
import VersionSelector from "./VersionSelector"
import VersionCreateDialog from "./VersionCreateDialog"
import { useVersionManager } from "../../hooks/chatbot/useVersionManager"

interface DocumentEditorProps {
  messages: Message[]
  inputValue: string
  streamedContent: string
  isStreaming: boolean
  selectedTemplate: DocumentTemplate | null
  onInputChange: (value: string) => void
  onSendMessage: () => void
  onBackToChat: () => void
  onBackToTemplateSelect: () => void
  onTemplateChange: (template: DocumentTemplate) => void
}

export default function DocumentEditor({
  messages,
  inputValue,
  streamedContent,
  isStreaming,
  selectedTemplate,
  onInputChange,
  onSendMessage,
  onBackToChat,
  onBackToTemplateSelect,
  onTemplateChange,
}: DocumentEditorProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [documentContent, setDocumentContent] = useState("")
  const [fontSize, setFontSize] = useState("16px")
  const [textColor, setTextColor] = useState("#000000")
  const [showVersionDialog, setShowVersionDialog] = useState(false)
  const [pendingContent, setPendingContent] = useState("")
  const [hasInitialVersion, setHasInitialVersion] = useState(false)
  const documentRef = useRef<HTMLDivElement>(null)
  const selectedTemplateRef = useRef<DocumentTemplate | null>(null)

  const {
    versions,
    currentVersionId,
    createVersion,
    updateVersion,
    selectVersion,
    getCurrentVersion,
    deleteVersion,
    renameVersion,
    generateVersionName,
    hasContentChanged,
    resetVersions,
  } = useVersionManager()

  // Update template ref
  selectedTemplateRef.current = selectedTemplate

  const getInitialDocumentHTML = useCallback(() => {
    return selectedTemplate?.htmlContent() || ""
  }, [selectedTemplate])

  // 스트리밍이 완료되면 첫 번째 버전 생성 (한 번만)
  useEffect(() => {
    if (!isStreaming && streamedContent && !hasInitialVersion && streamedContent.trim() !== "") {
      const templateName = selectedTemplateRef.current?.name || "기본 템플릿"
      createVersion(streamedContent, `${templateName} - 초기 버전`)
      setDocumentContent(streamedContent)
      setHasInitialVersion(true)
    }
  }, [isStreaming, streamedContent, hasInitialVersion, createVersion])

  // 현재 버전이 변경되면 문서 내용 업데이트
  useEffect(() => {
    const currentVersion = getCurrentVersion()
    if (currentVersion) {
      setDocumentContent(currentVersion.content)
    }
  }, [currentVersionId])

  // 템플릿이 변경되면 상태 초기화
  useEffect(() => {
    if (selectedTemplate && isStreaming) {
      // 템플릿 변경 시 상태 초기화 (스트리밍 시작 시에만)
      setHasInitialVersion(false)
      setDocumentContent("")
      resetVersions()
    }
  }, [selectedTemplate, isStreaming, resetVersions])

  const toggleEdit = () => {
    if (isEditing && documentRef.current) {
      const newContent = documentRef.current.innerHTML
      setDocumentContent(newContent)

      // 내용이 변경되었는지 확인
      if (hasContentChanged(newContent)) {
        // 변경사항이 있으면 버전 생성 다이얼로그 표시
        setPendingContent(newContent)
        setShowVersionDialog(true)
      } else {
        // 변경사항이 없으면 그냥 편집 모드 종료
        setIsEditing(false)
      }
    } else {
      setIsEditing(true)
    }
  }

  const handleVersionSave = (versionName: string) => {
    if (pendingContent) {
      createVersion(pendingContent, versionName)
      setPendingContent("")
    }
    setShowVersionDialog(false)
    setIsEditing(false)
  }

  const handleVersionCancel = () => {
    // 변경사항을 저장하지 않고 이전 상태로 복원
    const currentVersion = getCurrentVersion()
    if (currentVersion && documentRef.current) {
      documentRef.current.innerHTML = currentVersion.content
      setDocumentContent(currentVersion.content)
    }
    setPendingContent("")
    setShowVersionDialog(false)
    setIsEditing(false)
  }

  const handleCreateVersion = (name: string) => {
    const currentContent = documentRef.current?.innerHTML || documentContent || getInitialDocumentHTML()
    createVersion(currentContent, name)
  }

  const handleSelectVersion = (versionId: string) => {
    if (isEditing) {
      // 편집 중이면 경고 메시지 표시
      if (window.confirm("편집 중인 내용이 있습니다. 저장하지 않고 다른 버전으로 이동하시겠습니까?")) {
        setIsEditing(false)
        selectVersion(versionId)
      }
    } else {
      selectVersion(versionId)
    }
  }

  const applyStyle = (command: string, value?: string) => {
    if (documentRef.current && window.getSelection) {
      const selection = window.getSelection()
      if (selection && !selection.isCollapsed) {
        // 선택된 텍스트에 스타일 적용
        document.execCommand(command, false, value)
        const newContent = documentRef.current.innerHTML
        setDocumentContent(newContent)
      } else {
        // 텍스트가 선택되지 않은 경우 알림
        alert("텍스트를 먼저 선택해주세요.")
      }
    }
  }

  const applyAlignment = (align: string) => {
    if (documentRef.current) {
      const selection = window.getSelection()
      if (selection && selection.rangeCount > 0) {
        // 정렬 명령어 사용
        let command = ""
        switch (align) {
          case "left":
            command = "justifyLeft"
            break
          case "center":
            command = "justifyCenter"
            break
          case "right":
            command = "justifyRight"
            break
        }
        if (command) {
          document.execCommand(command, false, undefined)
          const newContent = documentRef.current.innerHTML
          setDocumentContent(newContent)
        }
      } else {
        alert("텍스트를 먼저 선택해주세요.")
      }
    }
  }

  const applyFontSize = (size: string) => {
    if (documentRef.current && window.getSelection) {
      const selection = window.getSelection()
      if (selection && !selection.isCollapsed) {
        // HTML5 방식으로 폰트 사이즈 적용
        const range = selection.getRangeAt(0)
        const span = document.createElement("span")
        span.style.fontSize = size

        try {
          range.surroundContents(span)
          selection.removeAllRanges()
          const newContent = documentRef.current.innerHTML
          setDocumentContent(newContent)
          setFontSize(size)
        } catch (e) {
          // 복잡한 선택 영역의 경우 execCommand 사용
          const sizeNumber = Number.parseInt(size.replace("px", ""))
          let htmlSize = "3" // 기본값

          // px를 HTML 사이즈로 변환
          if (sizeNumber <= 10) htmlSize = "1"
          else if (sizeNumber <= 13) htmlSize = "2"
          else if (sizeNumber <= 16) htmlSize = "3"
          else if (sizeNumber <= 18) htmlSize = "4"
          else if (sizeNumber <= 24) htmlSize = "5"
          else if (sizeNumber <= 32) htmlSize = "6"
          else htmlSize = "7"

          document.execCommand("fontSize", false, htmlSize)

          // 실제 픽셀 크기로 변환
          const fontElements = documentRef.current.querySelectorAll("font[size]")
          fontElements.forEach((element) => {
            const fontElement = element as HTMLElement
            fontElement.style.fontSize = size
            fontElement.removeAttribute("size")
          })

          const newContent = documentRef.current.innerHTML
          setDocumentContent(newContent)
          setFontSize(size)
        }
      } else {
        alert("텍스트를 먼저 선택해주세요.")
      }
    }
  }

  const applyTextColor = (color: string) => {
    if (documentRef.current && window.getSelection) {
      const selection = window.getSelection()
      if (selection && !selection.isCollapsed) {
        document.execCommand("foreColor", false, color)
        const newContent = documentRef.current.innerHTML
        setDocumentContent(newContent)
        setTextColor(color)
      } else {
        alert("텍스트를 먼저 선택해주세요.")
      }
    }
  }


  const handleUndo = () => {
    if (documentRef.current) {
      document.execCommand("undo", false, undefined)
      const newContent = documentRef.current.innerHTML
      setDocumentContent(newContent)
    }
  }

  const handleRedo = () => {
    if (documentRef.current) {
      document.execCommand("redo", false, undefined)
      const newContent = documentRef.current.innerHTML
      setDocumentContent(newContent)
    }
  }

  const handleTemplateChangeClick = () => {
    if (isEditing) {
      if (window.confirm("편집 중인 내용이 있습니다. 저장하지 않고 템플릿을 변경하시겠습니까?")) {
        setIsEditing(false)
        onBackToTemplateSelect()
      }
    } else {
      onBackToTemplateSelect()
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <ChatSidebar
        messages={messages}
        inputValue={inputValue}
        onInputChange={onInputChange}
        onSendMessage={onSendMessage}
      />
      <div className="flex-1 flex flex-col bg-white">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={onBackToChat} className="flex items-center space-x-2">
              <ArrowLeft className="w-4 h-4" />
              <span>돌아가기</span>
            </Button>
            <div>
              <h1 className="text-lg font-medium">보고서 내용 편집</h1>
              {selectedTemplate && <p className="text-sm text-gray-600">템플릿: {selectedTemplate.name}</p>}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={handleTemplateChangeClick} className="text-sm bg-transparent">
              템플릿 변경
            </Button>
            <VersionSelector
              versions={versions}
              currentVersionId={currentVersionId}
              onSelectVersion={handleSelectVersion}
              onCreateVersion={handleCreateVersion}
              onRenameVersion={renameVersion}
              onDeleteVersion={deleteVersion}
            />
            <SaveDropdown documentContent={documentContent || getInitialDocumentHTML()} documentRef={documentRef} />
            <Button onClick={toggleEdit} variant="outline" className="flex items-center space-x-2 bg-transparent">
              <Edit3 className="w-4 h-4" />
              <span>{isEditing ? "편집 완료" : "편집하기"}</span>
            </Button>
          </div>
        </div>

        {/* 고정된 툴바 영역 */}
        {isEditing && (
          <div className="border-b bg-white px-8 py-4">
            <EditorToolbar
              fontSize={fontSize}
              textColor={textColor}
              onApplyStyle={applyStyle}
              onApplyAlignment={applyAlignment}
              onApplyFontSize={applyFontSize}
              onApplyTextColor={applyTextColor}
              onUndo={handleUndo}
              onRedo={handleRedo}
            />
          </div>
        )}

        {/* 스크롤 가능한 문서 영역 */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="max-w-4xl mx-auto p-8">
            <div className="bg-white shadow-lg border border-gray-200 rounded-lg">
              <h1 className="text-2xl font-bold text-center mb-8 pt-8">증권신고서 자동 생성</h1>
              {isStreaming ? (
                <DocumentGenerationLoader streamedContent={streamedContent} selectedTemplate={selectedTemplate} />
              ) : (
                <div className="space-y-8 p-8">
                  {isEditing ? (
                    <div
                      ref={documentRef}
                      contentEditable
                      suppressContentEditableWarning={true}
                      className="min-h-[600px] p-6 border-2 border-dashed border-blue-300 rounded-lg focus:outline-none focus:border-blue-500 bg-blue-50/30"
                      dangerouslySetInnerHTML={{ __html: documentContent || getInitialDocumentHTML() }}
                    />
                  ) : (
                    <div
                      ref={documentRef}
                      className="min-h-[600px] p-6 bg-white border border-gray-100 rounded-lg shadow-sm"
                      dangerouslySetInnerHTML={{ __html: documentContent || getInitialDocumentHTML() }}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 버전 생성 다이얼로그 */}
      <VersionCreateDialog
        isOpen={showVersionDialog}
        onSave={handleVersionSave}
        onCancel={handleVersionCancel}
        suggestedName={generateVersionName()}
      />
    </div>
  )
}
