'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from './ui/button'
import { Edit3, X, AlertCircle, CheckCircle } from 'lucide-react'
import { saveDocumentContent, updateDocumentSection } from '../../lib/dart-viewer/document-actions'
import { getSectionKeyFromId } from '../../data/dart-viewer/mockDocumentData'
import { fillTemplate } from '../../service/securitiesDataService'
import React from 'react'

interface DocumentContentProps {
  userId: number,
  htmlContent: string
  sectionId: string
  sectionName?: string
  sectionType?: 'part' | 'section-1' | 'section-2'
  onSectionModified?: (sectionId: string, updatedHTML: string) => void
  modifiedSections?: Set<string>
  templateData?: Record<string, any> | null  // 외부에서 전달받은 템플릿 데이터
}

export function DocumentContent({ 
  userId,
  htmlContent, 
  sectionId, 
  sectionName, 
  sectionType,
  onSectionModified,
  modifiedSections,
  templateData  // 메인 페이지에서 전달받은 데이터
}: DocumentContentProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const [originalHtml, setOriginalHtml] = useState('')
  const [currentHtml, setCurrentHtml] = useState('')
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const hasSavedRef = useRef(false)

  // Reset states when section changes
  useEffect(() => {
    setIsEditing(false)
    setSaveMessage('')
    hasSavedRef.current = false
  }, [sectionId, sectionName])

  // Main content loading effect
  useEffect(() => {
    const loadContent = () => {
      console.log('🔄 [DocumentContent] 컨텐츠 로딩 시작...')
      console.log('📋 [DocumentContent] htmlContent 길이:', htmlContent?.length || 0)
      console.log('📊 [DocumentContent] templateData 상태:', templateData ? '있음' : '없음')
      
      if (!htmlContent) {
        console.log('❌ [DocumentContent] HTML 컨텐츠 없음')
        setHasError(true);
        return;
      }
      
      setIsLoading(true);
      setHasError(false);
      
      try {
        let processedHtml = htmlContent;

        // 섹션 타입에 따른 HTML 추출
        if (sectionName && sectionType && sectionType !== 'part') {
            console.log('🎯 [DocumentContent] 섹션별 처리:', { sectionName, sectionType })
            
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlContent, 'text/html');
            let extractedContent = '';
            
            if (sectionType === 'section-1') {
              const section1Elements = doc.querySelectorAll('.section-1');
              for (const element of Array.from(section1Elements)) {
                if (element.getAttribute('data-section') === sectionName) {
                  extractedContent = element.outerHTML;
                  break;
                }
              }
            } else if (sectionType === 'section-2') {
              const section2Elements = doc.querySelectorAll('.section-2');
              for (const element of Array.from(section2Elements)) {
                if (element.getAttribute('data-section') === sectionName) {
                  extractedContent = element.outerHTML;
                  break;
                }
              }
            }
            
            if (extractedContent) {
              const head = doc.querySelector('head')?.outerHTML || '';
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
              `;
            }
        }
        
        // 템플릿 데이터가 있으면 적용
        if (templateData) {
          console.log('🔥 [DocumentContent] 템플릿 데이터 적용 시작')
          console.log('📊 [DocumentContent] 템플릿 데이터 키들:', Object.keys(templateData))
          
          const beforeLength = processedHtml.length;
          processedHtml = fillTemplate(processedHtml, templateData);
          const afterLength = processedHtml.length;
          
          console.log('✅ [DocumentContent] 템플릿 적용 완료')
          console.log(`📏 [DocumentContent] HTML 길이 변화: ${beforeLength} → ${afterLength}`)
          
          // 템플릿이 적용된 일부를 로그로 확인
          const templateKeys = Object.keys(templateData);
          templateKeys.slice(0, 5).forEach(key => {
            const value = templateData[key];
            if (value && typeof value === 'string') {
              const keyExists = processedHtml.includes(value);
              console.log(`🔍 [DocumentContent] 키 "${key}" = "${value}" → HTML에 존재: ${keyExists}`);
            }
          });
          if (!hasSavedRef.current) {
            hasSavedRef.current = true
            const token = localStorage.getItem("accessToken");
            const sectionKey = getSectionKeyFromId(sectionId)
        
            saveDocumentContent(userId, sectionKey, processedHtml, token)
              .then(() => console.log("💾 [DocumentContent] 치환된 HTML 자동 저장 완료"))
              .catch(err => console.error("❌ [DocumentContent] 자동 저장 실패:", err))
          }
        } else {
          console.log('⚠️ [DocumentContent] 템플릿 데이터 없음 - 원본 HTML 사용')
        }

        // iframe에 HTML 적용
        if (iframeRef.current) {
          const iframeDoc = iframeRef.current.contentDocument;
          if (iframeDoc) {
            console.log('📝 [DocumentContent] iframe에 HTML 적용')
            iframeDoc.open();
            iframeDoc.write(processedHtml);
            iframeDoc.close();
            
            setOriginalHtml(processedHtml);
            setCurrentHtml(processedHtml);
            
            setTimeout(() => {
              ensureReadOnlyMode(iframeDoc);
              setIsLoading(false);
              console.log('✅ [DocumentContent] 컨텐츠 로딩 완료')
            }, 100);
          } else {
            console.error('❌ [DocumentContent] iframe document 접근 실패')
            setHasError(true);
            setIsLoading(false);
          }
        } else {
          console.error('❌ [DocumentContent] iframe ref 없음')
          setHasError(true);
          setIsLoading(false);
        }
        
      } catch (error) {
        console.error('💥 [DocumentContent] HTML 컨텐츠 로드 오류:', error);
        setHasError(true);
        setIsLoading(false);
      }
    };
    
    loadContent();
  }, [htmlContent, sectionId, sectionName, sectionType, templateData]); // templateData 의존성 추가

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

      const token = localStorage.getItem("accessToken");
      let result;

      const sectionKey = getSectionKeyFromId(sectionId)

      if (sectionName && sectionType && sectionType !== 'part') {
        result = await updateDocumentSection(userId, htmlContent, sectionName, sectionType, editedHtml, sectionId, sectionKey, token);
      } else {
        result = await saveDocumentContent(userId, sectionKey, editedHtml, token);
      }
      
      setCurrentHtml(editedHtml)
      setOriginalHtml(editedHtml)
      setIsEditing(false)
      
      setSaveMessage('편집이 완료되었습니다. "최종 저장"을 눌러 DB에 저장하세요.')
      
      setTimeout(() => {
        setSaveMessage('')
      }, 5000)
      
    } catch (error: any) {
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
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        {!isEditing && (
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