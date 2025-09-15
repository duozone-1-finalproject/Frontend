import { useState, useEffect, useRef } from 'react'
import { updateDocumentSection, validateSectionContent, reviseSectionContent } from '../../service/dartViewerService'
import { getSectionKeyFromId, findSectionById, isLeafSection, mockDocumentData, ensureReadOnlyMode } from '../../lib/dartViewerHelpers'
import { ValidationResponse, ValidationIssue } from '../../types/dartViewer'

export interface UseDocumentContentProps {
  userId: number
  corpCode: string | null
  companyName: string | null
  htmlContent: string
  sectionId: string
  sectionName?: string
  sectionType?: 'part' | 'section-1' | 'section-2'
  onSectionModified?: (sectionId: string, modifiedHtml: string) => void
  onValidateSection?: (sectionId: string, htmlContent: string) => void
  onVersionUpdate?: () => void
}

export function useDocumentContent({
  userId,
  corpCode,
  companyName,
  htmlContent,
  sectionId,
  sectionName,
  sectionType,
  onSectionModified,
  onValidateSection,
  onVersionUpdate
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
  const [hasValidationData, setHasValidationData] = useState(false) // 검증 데이터 존재 여부 (편집용)
  const [validationStep, setValidationStep] = useState(0)
  const [validationProgress, setValidationProgress] = useState(0)
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

      if (!corpCode) {
        throw new Error('corpCode가 필요합니다.');
      }
      if (!companyName) {
        throw new Error('companyName이 필요합니다.');
      }
      result = await updateDocumentSection(userId, corpCode, companyName, sectionKey, editedHtml, options);
      
      setCurrentHtml(editedHtml)
      setOriginalHtml(editedHtml)
      setIsEditing(false)

      setSaveMessage('편집이 완료되었습니다. "최종 저장"을 눌러 DB에 저장하세요.')

      // currentVersion을 "editing"으로 업데이트
      if (onVersionUpdate) {
        onVersionUpdate()
      }

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
    
    // 새 검증 시작 시 이전 결과 초기화
    setValidationMessage('')
    setValidationResult(null)
    setHasValidationData(false)
    
    setIsValidating(true)
    setValidationStep(1)
    setValidationProgress(0)
    
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
    
    try {
      // Step 1: 문서 분석 시작
      setValidationMessage('1️⃣ 문서 구조 분석 중...')
      setValidationProgress(20)
      await delay(800)
      
      const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document
      if (!iframeDoc) return
      
      // Step 2: 내용 추출
      setValidationStep(2)
      setValidationMessage('2️⃣ 문서 내용 추출 중...')
      setValidationProgress(40)
      await delay(600)
      
      const currentRenderedHtml = iframeDoc.documentElement.outerHTML
      console.log('Extracted HTML length:', currentRenderedHtml.length)
      
      // Step 3: AI 검증 요청
      setValidationStep(3)
      setValidationMessage('3️⃣ AI 검증 분석 중...')
      setValidationProgress(60)
      await delay(400)
      
      // 백엔드 API 호출하여 검증 수행
      const result = await validateSectionContent(userId, sectionId, currentRenderedHtml)
      
      // Step 4: 결과 처리
      setValidationStep(4)
      setValidationMessage('4️⃣ 검증 결과 처리 중...')
      setValidationProgress(80)
      await delay(500)
      
      // Step 5: 완료
      setValidationProgress(100)
      await delay(300)
      
      if (result.success && result.validationData) {
        const validationData = result.validationData as ValidationResponse
        console.log('Validation data:', validationData)
        setValidationResult(validationData)
        setHasValidationData(true) // 검증 데이터 존재 표시
        
        // 텍스트 하이라이팅 적용
        highlightValidationIssues(validationData)
        
        // 검증 결과에 따른 메시지 설정
        if (validationData.decision === 'approve') {
          setValidationMessage('✅ 검증 완료: 문제없습니다!')
        } else {
          const issueCount = validationData.issues.length
          const highCount = validationData.issues.filter(i => i.severity === 'high').length
          const mediumCount = validationData.issues.filter(i => i.severity === 'medium').length
          
          if (highCount > 0) {
            setValidationMessage(`⚠️ 검증 완료: ${issueCount}개 문제점 발견 (심각: ${highCount}개)`)
          } else if (mediumCount > 0) {
            setValidationMessage(`⚠️ 검증 완료: ${issueCount}개 문제점 발견 (보통: ${mediumCount}개)`)
          } else {
            setValidationMessage(`💡 검증 완료: ${issueCount}개 개선사항 발견`)
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
      setValidationStep(0)
      setValidationProgress(0)
      
      // 검증 결과 메시지를 계속 표시 (자동 삭제하지 않음)
    }
  }

  // 검증 결과 초기화 함수
  const clearValidationResult = () => {
    setValidationResult(null)
    setValidationMessage('')
  }

  // 검증 메시지만 숨기기 (편집용 데이터는 보존)
  const hideValidationMessage = () => {
    setValidationMessage('')
    // hasValidationData는 그대로 두어 편집 시 검증창 버튼이 계속 보이도록 함
  }

  // AI를 통한 자동 수정
  const handleAIRevision = async (issue: ValidationIssue) => {
    try {
      console.log('AI 수정 시작:', issue)

      // AI 수정 요청
      const revisionResult = await reviseSectionContent({
        span: issue.span,
        reason: issue.reason,
        rule_id: issue.rule_id || '',
        evidence: issue.evidence || '',
        suggestion: issue.suggestion,
        severity: issue.severity
      })
      console.log("AI 수정 결과:", revisionResult)

      if (!revisionResult.success || !revisionResult.revisedText) {
        return { success: false, message: revisionResult.message || 'AI 수정에 실패했습니다.' }
      }

      return { 
        success: true, 
        message: 'AI 수정된 텍스트가 준비되었습니다.',
        revisedText: revisionResult.revisedText
      }

    } catch (error: any) {
      console.error('AI 수정 처리 오류:', error)
      return { success: false, message: 'AI 수정 중 오류가 발생했습니다.' }
    }
  }

  // 텍스트 하이라이팅 함수
  const highlightValidationIssues = (validationData: ValidationResponse) => {
    if (!iframeRef.current) return
    
    const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document
    if (!iframeDoc) return

    // 기존 하이라이트 제거
    const existingHighlights = iframeDoc.querySelectorAll('.validation-highlight')
    existingHighlights.forEach(el => {
      const parent = el.parentNode
      if (parent) {
        parent.replaceChild(el.firstChild!, el)
        parent.normalize()
      }
    })

    // CSS 스타일 추가 (한 번만)
    if (!iframeDoc.querySelector('#validation-styles')) {
      const style = iframeDoc.createElement('style')
      style.id = 'validation-styles'
      style.textContent = `
        @keyframes flash {
          0%, 100% { 
            background-color: inherit; 
            transform: scale(1);
          }
          50% { 
            background-color: #fbbf24 !important; 
            transform: scale(1.02);
          }
        }
        .validation-highlight {
          transition: all 0.3s ease;
        }
        .validation-highlight.flash-animation {
          animation: flash 1s ease-in-out 3;
        }
      `
      iframeDoc.head.appendChild(style)
    }

    // 새로운 하이라이트 추가
    validationData.issues.forEach((issue, issueIndex) => {
      const spanText = issue.span.trim()
      if (!spanText) return

      try {
        // 다양한 방식으로 텍스트 찾기 (우선순위 순)
        const searchTexts = [
          spanText, // 원본 텍스트
          spanText.replace(/\s+/g, ' '), // 공백 정규화
          spanText.replace(/[\r\n\t]+/g, ' ').trim(), // 개행문자, 탭 제거
          spanText.replace(/[^\w\s가-힣]/g, '').trim(), // 특수문자 제거 (한글, 영문, 숫자, 공백만)
          spanText.substring(0, 50), // 앞 50글자
          spanText.substring(0, 30), // 앞 30글자
          spanText.substring(0, 20), // 앞 20글자
          spanText.substring(0, 15), // 앞 15글자
          spanText.substring(spanText.length - 30), // 뒤 30글자
          spanText.substring(spanText.length - 20), // 뒤 20글자
          spanText.substring(spanText.length - 15), // 뒤 15글자
          spanText.split('\n')[0].trim(), // 첫 번째 줄
          spanText.split('\n').pop()?.trim(), // 마지막 줄
          spanText.split(' ').slice(0, 5).join(' '), // 처음 5단어
          spanText.split(' ').slice(-5).join(' '), // 마지막 5단어
          spanText.split(' ').slice(0, 3).join(' '), // 처음 3단어
          spanText.split(' ').slice(-3).join(' '), // 마지막 3단어
          spanText.replace(/\d+/g, '').trim(), // 숫자 제거
          spanText.replace(/[(){}[\]]/g, '').trim(), // 괄호 제거
          spanText.substring(10, spanText.length - 10), // 양쪽 10글자씩 제거한 중간 부분
        ].filter(text => text && text.length >= 3) // 3글자 이상만 유효

        let found = false

        for (const searchText of searchTexts) {
          if (found || !searchText) continue

          // 전체 body 텍스트에서 검색 (대소문자 구분 없이)
          const bodyText = (iframeDoc.body.innerText || iframeDoc.body.textContent || '').toLowerCase()
          const searchTextLower = searchText.toLowerCase()
          if (!bodyText.includes(searchTextLower)) continue
          
          // TreeWalker로 텍스트 노드 찾기 (대소문자 구분 없이)
          const walker = iframeDoc.createTreeWalker(
            iframeDoc.body,
            NodeFilter.SHOW_TEXT,
            {
              acceptNode: (node) => {
                const text = (node.textContent || '').toLowerCase()
                return text.trim() && text.includes(searchTextLower)
                  ? NodeFilter.FILTER_ACCEPT
                  : NodeFilter.FILTER_REJECT
              }
            }
          )

          let textNode
          while (textNode = walker.nextNode() as Text) {
            const text = textNode.textContent || ''
            const textLower = text.toLowerCase()
            const textIndex = textLower.indexOf(searchTextLower)

            if (textIndex !== -1) {
              // 하이라이트 요소 생성
              const highlightSpan = iframeDoc.createElement('span')
              highlightSpan.className = `validation-highlight validation-${issue.severity}`
              highlightSpan.style.cssText = `
                background-color: ${issue.severity === 'high' ? 'rgba(239, 68, 68, 0.3)' : 
                                   issue.severity === 'medium' ? 'rgba(245, 158, 11, 0.3)' : 
                                   'rgba(234, 179, 8, 0.3)'} !important;
                border-bottom: 2px solid ${issue.severity === 'high' ? '#ef4444' : 
                                          issue.severity === 'medium' ? '#f59e0b' : 
                                          '#eab308'};
                cursor: pointer;
                position: relative;
                padding: 2px 4px;
                border-radius: 3px;
              `
              highlightSpan.title = `${issue.reason}\n\n💡 ${issue.suggestion}`
              highlightSpan.setAttribute('data-issue-index', issueIndex.toString())
              highlightSpan.setAttribute('data-issue-text', spanText)
              
              // 텍스트 분할 및 하이라이트 적용
              const beforeText = text.substring(0, textIndex)
              const highlightText = text.substring(textIndex, textIndex + searchText.length)
              const afterText = text.substring(textIndex + searchText.length)

              const parent = textNode.parentNode!
              
              if (beforeText) {
                parent.insertBefore(iframeDoc.createTextNode(beforeText), textNode)
              }
              
              highlightSpan.textContent = highlightText
              parent.insertBefore(highlightSpan, textNode)
              
              if (afterText) {
                parent.insertBefore(iframeDoc.createTextNode(afterText), textNode)
              }
              
              parent.removeChild(textNode)
              found = true
              break
            }
          }
        }
      } catch (error) {
        console.warn('텍스트 하이라이팅 실패:', error)
      }
    })
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
    hasValidationData,
    validationStep,
    validationProgress,
    
    // refs
    iframeRef,
    
    // handlers
    handleEdit,
    handleSave,
    handleCancel,
    handleImageInsert,
    handleRetry,
    handleValidate,
    clearValidationResult,
    highlightValidationIssues,
    setValidationMessage,
    setValidationResult,
    hideValidationMessage,
    handleAIRevision
  }
}