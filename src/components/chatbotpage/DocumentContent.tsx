import { EditorContent, type Editor } from "@tiptap/react"
import { EditorToolbar } from "./EditorToolbar"
import { getInitialDocumentHTML } from "../../utils/documentUtils"

interface DocumentContentProps {
  isEditing: boolean
  isStreaming: boolean
  streamedContent: string
  documentContent: string
  editor: Editor | null
}

export function DocumentContent({
  isEditing,
  isStreaming,
  streamedContent,
  documentContent,
  editor,
}: DocumentContentProps) {
  if (isStreaming) {
    return (
      <div className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
        {streamedContent}
        <span className="animate-pulse">|</span>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {isEditing ? (
        // 편집 모드 - Tiptap 에디터
        <div className="border border-gray-200 rounded-lg overflow-hidden h-[700px] flex flex-col">
          <EditorToolbar editor={editor} documentContent={documentContent} />
          <div className="flex-1 overflow-y-auto bg-white">
            <EditorContent editor={editor} className="prose prose-sm max-w-none focus:outline-none h-full" />
          </div>
        </div>
      ) : (
        // 읽기 모드
        <div className="min-h-[600px] p-6">
          <div
            className="document-container"
            dangerouslySetInnerHTML={{
              __html: documentContent || getInitialDocumentHTML(),
            }}
          />
        </div>
      )}
    </div>
  )
}
