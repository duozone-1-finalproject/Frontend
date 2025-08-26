'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from './ui/button'
import { Edit3, X, AlertCircle, CheckCircle } from 'lucide-react'
import { saveDocumentContent, updateDocumentSection } from '../../lib/dart-viewer/document-actions'
import { getSectionKeyFromId } from '../../data/dart-viewer/mockDocumentData'
import React from 'react'

interface DocumentContentProps {
  userId: number,
  htmlContent: string
  sectionId: string
  sectionName?: string
  sectionType?: 'part' | 'section-1' | 'section-2'
  onSectionModified?: (sectionId: string, updatedHTML: string) => void
  modifiedSections?: Set<string>
}

export function DocumentContent({ 
  userId,
  htmlContent, 
  sectionId, 
  sectionName, 
  sectionType,
  onSectionModified,
  modifiedSections 
}: DocumentContentProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const [originalHtml, setOriginalHtml] = useState('')
  const [currentHtml, setCurrentHtml] = useState('')
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    setIsEditing(false)
    setSaveMessage('')
  }, [sectionId, sectionName])

  useEffect(() => {
    const loadContent = async () => {
      if (!htmlContent) {
        setHasError(true)
        return
      }
      setIsLoading(true)
      setHasError(false)
      try {
        let processedHtml = htmlContent
        if (sectionName && sectionType && sectionType !== 'part') {
          const parser = new DOMParser()
          const doc = parser.parseFromString(htmlContent, 'text/html')
          let extractedContent = ''
          if (sectionType === 'section-1') {
            const section1Elements = doc.querySelectorAll('.section-1')
            for (const element of section1Elements) {
              if (element.getAttribute('data-section') === sectionName) {
                extractedContent = element.outerHTML
                break
              }
            }
          } else if (sectionType === 'section-2') {
            const section2Elements = doc.querySelectorAll('.section-2')
            for (const element of section2Elements) {
              if (element.getAttribute('data-section') === sectionName) {
                extractedContent = element.outerHTML
                break
              }
            }
          }
          if (extractedContent) {
            const head = doc.querySelector('head')?.outerHTML || ''
            processedHtml = `
              <!DOCTYPE html>
              <html lang="ko">
              ${head}
              <body>
                <div class="document-content">
                  ${extractedContent}
                </div>
              </body>
              </html>
            `
          }
        }
        if (iframeRef.current) {
          const iframe = iframeRef.current
          const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document
          if (iframeDoc) {
            iframeDoc.open()
            iframeDoc.write(processedHtml)
            iframeDoc.close()
            setOriginalHtml(processedHtml)
            setCurrentHtml(processedHtml)
            setTimeout(() => {
              ensureReadOnlyMode(iframeDoc)
              setIsLoading(false)
            }, 100)
          }
        }
      } catch (error) {
        console.error('HTML 컨텐츠 로드 오류:', error)
        setHasError(true)
        setIsLoading(false)
      }
    }
    loadContent()
  }, [htmlContent, sectionId, sectionName, sectionType])

  const ensureReadOnlyMode = (iframeDoc: Document) => {
    const body = iframeDoc.body
    if (body) {
      body.contentEditable = 'false'
      body.style.outline = 'none'
      body.style.outlineOffset = '0'
      const existingStyles = iframeDoc.querySelectorAll('style')
      existingStyles.forEach(style => {
        if (style.textContent?.includes('contenteditable')) {
          style.remove()
        }
      })
    }
  }

  const handleEdit = () => {
    if (!iframeRef.current) return
    const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document
    if (!iframeDoc) return
    setOriginalHtml(iframeDoc.documentElement.outerHTML)
    const body = iframeDoc.body
    if (body) {
      body.contentEditable = 'true'
      body.style.outline = '2px dashed #3b82f6'
      body.style.outlineOffset = '4px'
      body.focus()
    }
    setIsEditing(true)
    setSaveMessage('')
  }

  // 💡 handleSave 함수 수정
  const handleSave = async () => {
    if (!iframeRef.current) return
    
    setIsSaving(true)
    setSaveMessage('')
    
    let editedHtml = "";
    
    try {
      const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document
      if (!iframeDoc) return

      const body = iframeDoc.body
      if (body) {
        body.contentEditable = 'false'
        body.removeAttribute('contenteditable')
        body.style.outline = 'none'
        body.style.outlineOffset = '0'
      }
      
      editedHtml = iframeDoc.documentElement.outerHTML

      const token = localStorage.getItem("accessToken"); // 토큰 가져오기
      let result;

      const sectionKey = getSectionKeyFromId(sectionId)

      if (sectionName && sectionType && sectionType !== 'part') {
        // updateDocumentSection 호출 시 token 전달
        result = await updateDocumentSection(userId, htmlContent, sectionName, sectionType, editedHtml, sectionId, sectionKey, token);
      } else {
        // saveDocumentContent 호출 시 token 전달
        result = await saveDocumentContent(userId, sectionKey, editedHtml, token);
      }
      
      setCurrentHtml(editedHtml)
      setOriginalHtml(editedHtml)
      setIsEditing(false)
      
      setSaveMessage('편집이 완료되었습니다. "최종 저장"을 눌러 DB에 저장하세요.')
      
      setTimeout(() => {
        setSaveMessage('')
      }, 5000)
      
    } catch (error) {
      console.error('편집 완료 오류:', error)
      setSaveMessage('편집 완료 중 오류가 발생했습니다.')
      
      const iframeDoc = iframeRef.current?.contentDocument || iframeRef.current?.contentWindow?.document
      const body = iframeDoc?.body
      if (body) {
        body.contentEditable = 'true'
        body.style.outline = '2px dashed #3b82f6'
        body.style.outlineOffset = '4px'
      }
    } finally {
      if (onSectionModified) {
        if (editedHtml !== null) {
          onSectionModified(sectionId, editedHtml);
        }
      }
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    if (!iframeRef.current) return
    
    const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document
    if (iframeDoc && originalHtml) {
      iframeDoc.open()
      iframeDoc.write(originalHtml)
      iframeDoc.close()
      
      setTimeout(() => {
        ensureReadOnlyMode(iframeDoc)
      }, 100)
    }
    
    setIsEditing(false)
    setSaveMessage('')
  }

  const handleImageInsert = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'

    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = () => {
        const imgSrc = reader.result as string
        const iframeDoc = iframeRef.current?.contentDocument
        if (!iframeDoc) return

        const selection = iframeDoc.getSelection()
        if (!selection || !selection.rangeCount) return

        const img = iframeDoc.createElement('img')
        img.src = imgSrc
        img.style.maxWidth = '100%'
        img.style.height = 'auto'

        const range = selection.getRangeAt(0)
        range.insertNode(img)
      }
      reader.readAsDataURL(file)
    }

    input.click()
  }

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
      {/* 편집 도구바 */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        {isEditing ? (
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
        ) : (
          <Button
            onClick={handleEdit}
            size="sm"
            variant="outline"
            className="bg-white shadow-md hover:bg-gray-50"
          >
            <Edit3 className="w-4 h-4 mr-1" />
            편집 시작
          </Button>
        )}
      </div>

      {/* 이하 JSX 코드는 동일 */}
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
              onClick={() => {
                setHasError(false)
                setIsLoading(true)
              }}
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