'use client'

import React from 'react'
import { Button } from './ui/button'
import { Edit3, X, AlertCircle, CheckCircle } from 'lucide-react'
import { useDocumentContent } from '../../hooks/dart-viewer/useDocumentContent'
import { TemplateData } from '../../types/dartViewer'

interface DocumentContentProps {
  userId: number,
  htmlContent: string
  sectionId: string
  sectionName?: string
  sectionType?: 'part' | 'section-1' | 'section-2'
  onSectionModified?: (sectionId: string, updatedHTML: string) => void
  templateData?: TemplateData | null
  onValidateSection?: (sectionId: string, htmlContent: string) => void
}

export function DocumentContent({ 
  userId,
  htmlContent, 
  sectionId, 
  sectionName, 
  sectionType,
  onSectionModified,
  templateData,
  onValidateSection
}: DocumentContentProps) {
  const {
    isLoading,
    hasError,
    isEditing,
    isSaving,
    saveMessage,
    isEditable,
    isValidating,
    validationMessage,
    validationResult,
    iframeRef,
    handleEdit,
    handleSave,
    handleCancel,
    handleImageInsert,
    handleRetry,
    handleValidate,
    clearValidationResult
  } = useDocumentContent({
    userId,
    htmlContent,
    sectionId,
    sectionName,
    sectionType,
    templateData,
    onSectionModified,
    onValidateSection
  })

  if (!htmlContent) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600 text-sm">선택된 섹션의 내용이 없습니다.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full relative">
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        {!isEditing && isEditable && (
            <>
              <Button
                onClick={handleEdit}
                size="sm"
                variant="outline"
                className="bg-white shadow-md hover:bg-gray-50"
              >
                <Edit3 className="w-4 h-4 mr-1" />
                편집 시작
              </Button>
              <Button
                onClick={handleValidate}
                disabled={isValidating}
                size="sm"
                variant="outline"
                className="bg-purple-600 text-white hover:bg-purple-700"
              >
                {isValidating ? '검증 중...' : '검증'}
              </Button>
            </>
        )}

        {isEditing && (
            <div className="flex items-center gap-2">
                <Button
                    onClick={handleImageInsert}
                    size="sm"
                    variant="outline"
                    className="bg-white shadow-md hover:bg-gray-50"
                >
                    이미지 추가
                </Button>
                <Button
                    onClick={handleSave}
                    size="sm"
                    disabled={isSaving}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    {isSaving ? '편집 완료 중...' : '편집 완료'}
                </Button>

                <Button
                    onClick={handleCancel}
                    size="sm"
                    variant="outline"
                    className="bg-white"
                >
                    <X className="w-4 h-4 mr-1" />
                    취소
                </Button>
            </div>
        )}
      </div>

      {/* 검증 메시지 */}
      {validationMessage && (
        <div className={`absolute top-16 right-4 z-20 p-3 rounded-md shadow-md max-w-sm transition-opacity duration-300 ${
          validationMessage.includes('✅') 
            ? 'bg-green-100 text-green-800 border border-green-200'
            : validationMessage.includes('⚠️')
            ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          <div className="flex items-center gap-2">
            <span className="text-sm">{validationMessage}</span>
          </div>
          {validationResult && validationResult.issues.length > 0 && (
            <button
              onClick={clearValidationResult}
              className="text-xs underline mt-1 block"
            >
              상세 보기
            </button>
          )}
        </div>
      )}

      {isEditing && (
        <div className="absolute top-16 right-4 z-20 bg-blue-100 text-blue-800 p-3 rounded-md shadow-md max-w-sm">
          <div className="flex items-center gap-2">
            <Edit3 className="w-4 h-4" />
            <span className="text-sm font-medium">편집 중</span>
          </div>
          <p className="text-xs mt-1">
            문서 내용을 직접 클릭하여 수정할 수 있습니다.
          </p>
        </div>
      )}
      
      {saveMessage && (
        <div className={`absolute ${isEditing ? 'top-32' : 'top-16'} right-4 z-20 p-3 rounded-md shadow-md max-w-sm transition-opacity duration-300 ${
          saveMessage.includes('완료') || saveMessage.includes('성공')
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          <div className="flex items-center gap-2">
            {saveMessage.includes('완료') || saveMessage.includes('성공') ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            <span className="text-sm">{saveMessage}</span>
          </div>
        </div>
      )}
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600 text-sm">문서를 불러오는 중...</p>
          </div>
        </div>
      )}
      
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-red-600 text-sm mb-2">문서를 불러올 수 없습니다.</p>
            <button 
              onClick={handleRetry}
              className="text-blue-600 text-sm hover:underline"
            >
              다시 시도
            </button>
          </div>
        </div>
      )}
      
      <iframe
        ref={iframeRef}
        key={`${sectionId}-${sectionName || 'full'}-${htmlContent.length}`}
        className="w-full h-full border-0"
        title="Document Content"
        sandbox="allow-same-origin allow-scripts"
        style={{ display: isLoading || hasError ? 'none' : 'block' }}
      />
    </div>
  )
}