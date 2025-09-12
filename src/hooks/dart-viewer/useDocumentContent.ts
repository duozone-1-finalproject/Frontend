import { useState, useEffect, useRef } from 'react'
import { updateDocumentSection, validateSectionContent } from '../../service/dartViewerService'
import { getSectionKeyFromId, findSectionById, isLeafSection, mockDocumentData, ensureReadOnlyMode } from '../../lib/dartViewerHelpers'
import { ValidationResponse } from '../../types/dartViewer'

export interface UseDocumentContentProps {
  userId: number
  htmlContent: string
  sectionId: string
  sectionName?: string
  sectionType?: 'part' | 'section-1' | 'section-2'
  onSectionModified?: (sectionId: string, modifiedHtml: string) => void
  onValidateSection?: (sectionId: string, htmlContent: string) => void
}

export function useDocumentContent({
  userId,
  htmlContent,
  sectionId,
  sectionName,
  sectionType,
  onSectionModified,
  onValidateSection
}: UseDocumentContentProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const [originalHtml, setOriginalHtml] = useState('')
  const [currentHtml, setCurrentHtml] = useState('')
  const [isValidating, setIsValidating] = useState(false)
  const [validationMessage, setValidationMessage] = useState('')
  const [validationResult, setValidationResult] = useState<ValidationResponse | null>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const hasSavedRef = useRef(false)


  // 현재 섹션이 최하위 섹션(편집 가능한 섹션)인지 확인
  const currentSection = findSectionById(mockDocumentData, sectionId)
  const isEditable = isLeafSection(currentSection)

  // 섹션 변경 시 편집 상태 초기화
  useEffect(() => {
    setIsEditing(false)
    setSaveMessage('')
    hasSavedRef.current = false
  }, [sectionId, sectionName])

  // 컨텐츠 로딩
  useEffect(() => {
    const loadContent = () => {
      if (!htmlContent) {
        setHasError(true);
        return;
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
            for (const element of Array.from(section1Elements)) {
              if (element.getAttribute('data-section') === sectionName) {
                extractedContent = element.outerHTML
                break
              }
            }
          } else if (sectionType === 'section-2') {
            const section2Elements = doc.querySelectorAll('.section-2')
            for (const element of Array.from(section2Elements)) {
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
          const iframeDoc = iframeRef.current.contentDocument
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
    
    let editedHtml = ""
    let result: any = null
    
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

      const sectionKey = getSectionKeyFromId(sectionId)
      const options = {
        htmlContent,
        sectionName,
        sectionType,
      }

      result = await updateDocumentSection(userId, sectionKey, editedHtml, options);
      
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
        const finalHtml = result?.data || editedHtml
        onSectionModified(sectionId, finalHtml)
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

  const handleRetry = () => {
    setHasError(false)
    setIsLoading(true)
  }

  const handleValidate = async () => {
    if (!iframeRef.current) return
    
    setIsValidating(true)
    setValidationMessage('검증 중입니다...')
    
    try {
      const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document
      if (!iframeDoc) return
      
      // 현재 렌더링된 HTML 추출
      const currentRenderedHtml = iframeDoc.documentElement.outerHTML
      console.log('Extracted HTML length:', currentRenderedHtml.length)
      
      // 백엔드 API 호출하여 검증 수행
      const result = await validateSectionContent(userId, sectionId, currentRenderedHtml)
      
      if (result.success && result.validationData) {
        const validationData = result.validationData as ValidationResponse
        console.log('Validation data:', validationData)
        setValidationResult(validationData)
        
        // 검증 결과에 따른 메시지 설정
        if (validationData.decision === 'approve') {
          setValidationMessage('✅ 검증 통과: 문제없습니다!')
        } else {
          const issueCount = validationData.issues.length
          const highCount = validationData.issues.filter(i => i.severity === 'high').length
          const mediumCount = validationData.issues.filter(i => i.severity === 'medium').length
          
          if (highCount > 0) {
            setValidationMessage(`⚠️ ${issueCount}개의 문제점 발견 (심각: ${highCount}개)`)
          } else if (mediumCount > 0) {
            setValidationMessage(`⚠️ ${issueCount}개의 문제점 발견 (보통: ${mediumCount}개)`)
          } else {
            setValidationMessage(`💡 ${issueCount}개의 개선사항 발견`)
          }
        }
        
        // 검증 데이터 저장 (UI에서 표시용)
        console.log('검증 데이터:', validationData);
        
        // 검증 콜백 함수가 있다면 호출
        if (onValidateSection) {
          onValidateSection(sectionId, currentRenderedHtml)
        }
      } else {
        setValidationMessage(result.message || '검증 중 오류가 발생했습니다.')
      }
      
    } catch (error: any) {
      console.error('검증 오류:', error)
      setValidationMessage('검증 중 오류가 발생했습니다.')
    } finally {
      setIsValidating(false)
      
      // 8초 후 검증 메시지 자동 삭제 (페이드아웃 효과와 함께)
      setTimeout(() => {
        setValidationMessage('')
      }, 8000)
    }
  }

  // 검증 결과 초기화 함수
  const clearValidationResult = () => {
    setValidationResult(null)
    setValidationMessage('')
  }

  return {
    // states
    isLoading,
    hasError,
    isEditing,
    isSaving,
    saveMessage,
    originalHtml,
    currentHtml,
    isEditable,
    isValidating,
    validationMessage,
    validationResult,
    
    // refs
    iframeRef,
    
    // handlers
    handleEdit,
    handleSave,
    handleCancel,
    handleImageInsert,
    handleRetry,
    handleValidate,
    clearValidationResult
  }
}