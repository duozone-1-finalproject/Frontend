'use client'

import { Button } from '../common/Button'
import { Edit3, X, AlertCircle, CheckCircle, MapPin } from 'lucide-react'
import { useDocumentContent } from '../../hooks/dart-viewer/useDocumentContent'
import { DocumentContentProps, ValidationIssue } from '../../types/dartViewer'
import { ValidationPanel } from './ValidationPanel'
import GuidelinesDropdown from '../GuidelinesDropdown'
import { useState } from 'react'

export function DocumentContent({
  userId,
  corpCode,
  companyName,
  htmlContent,
  sectionId,
  sectionName,
  sectionType,
  onSectionModified,
  modifiedSections,
  onVersionUpdate
}: DocumentContentProps) {
  const [showValidationPanel, setShowValidationPanel] = useState(false)
  const [aiProcessingIssues, setAiProcessingIssues] = useState<Set<number>>(new Set())
  const [aiRevisedTexts, setAiRevisedTexts] = useState<Record<number, string>>({})
  const [clickedCopyButtons, setClickedCopyButtons] = useState<Set<number>>(new Set())
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
    hasValidationData,
    validationStep,
    validationProgress,
    iframeRef,
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
  } = useDocumentContent({
    userId,
    corpCode,
    companyName,
    htmlContent,
    sectionId,
    sectionName,
    sectionType,
    onSectionModified,
    onVersionUpdate,
  })

  // 검증 시작 핸들러
  const handleValidateStart = () => {
    // 새로운 검증 시작 시 이전 AI 수정된 텍스트들과 클릭 상태 초기화
    setAiRevisedTexts({})
    setClickedCopyButtons(new Set())
    handleValidate()
  }

  // AI 수정 핸들러
  const handleAIRevisionClick = async (issue: ValidationIssue, index: number) => {
    setAiProcessingIssues(prev => new Set(prev).add(index))
    
    try {
      const result = await handleAIRevision(issue)
      if (result.success && result.revisedText) {
        // AI 수정된 텍스트를 상태에 저장
        setAiRevisedTexts(prev => ({
          ...prev,
          [index]: result.revisedText
        }))
        console.log('AI 수정 성공:', result.message)
      } else {
        alert('AI 수정 실패: ' + result.message)
      }
    } catch (error) {
      alert('AI 수정 중 오류가 발생했습니다.')
    } finally {
      setAiProcessingIssues(prev => {
        const newSet = new Set(prev)
        newSet.delete(index)
        return newSet
      })
    }
  }

  // 텍스트 복사 핸들러
  const handleCopyText = (text: string, index: number) => {
    // 클릭 애니메이션을 위한 상태 설정
    setClickedCopyButtons(prev => new Set(prev).add(index))
    
    // 클립보드에 복사
    navigator.clipboard.writeText(text).catch(() => {
      // 복사 실패해도 조용히 처리
    })
    
    // 2초 후 클릭 상태 제거
    setTimeout(() => {
      setClickedCopyButtons(prev => {
        const newSet = new Set(prev)
        newSet.delete(index)
        return newSet
      })
    }, 2000)
  }

  // 문제 위치로 이동 핸들러
  const handleNavigateToIssue = (issue: ValidationIssue, index: number) => {
    // 해당 텍스트가 하이라이트된 위치로 스크롤
    if (!iframeRef.current) return
    
    const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document
    if (!iframeDoc) return
    
    console.log('찾는 이슈:', issue.span.substring(0, 50) + '...')
    
    // 하이라이트된 요소 중에서 해당 이슈와 매칭되는 것 찾기
    const highlights = iframeDoc.querySelectorAll('.validation-highlight')
    console.log('발견된 하이라이트 수:', highlights.length)
    
    let targetHighlight: HTMLElement | null = null
    
    // 1. 정확한 인덱스로 찾기
    targetHighlight = Array.from(highlights).find(el => 
      el.getAttribute('data-issue-index') === index.toString()
    ) as HTMLElement
    
    // 2. 텍스트 내용으로 찾기 (다양한 방법 시도)
    if (!targetHighlight) {
      const spanText = issue.span.trim()
      const searchTexts = [
        spanText, // 원본 텍스트
        spanText.replace(/\s+/g, ' '), // 공백 정규화
        spanText.replace(/[\r\n\t]+/g, ' ').trim(), // 개행문자, 탭 제거
        spanText.replace(/[^\w\s가-힣]/g, '').trim(), // 특수문자 제거
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

      for (const searchText of searchTexts) {
        if (targetHighlight || !searchText) break

        targetHighlight = Array.from(highlights).find(el => {
          const elText = (el.textContent?.trim() || '').toLowerCase()
          const dataText = (el.getAttribute('data-issue-text') || '').toLowerCase()
          const searchTextLower = searchText.toLowerCase()

          return elText.includes(searchTextLower) ||
                 dataText.includes(searchTextLower) ||
                 searchTextLower.includes(elText) ||
                 searchTextLower.includes(dataText)
        }) as HTMLElement
      }
    }
    
    console.log('찾은 타겟:', targetHighlight)
    
    if (targetHighlight) {
      // 기존 flash 클래스 제거
      iframeDoc.querySelectorAll('.flash-animation').forEach(el => {
        el.classList.remove('flash-animation')
      })
      
      // 새로운 flash 애니메이션 추가
      targetHighlight.classList.add('flash-animation')
      
      // 스크롤 이동 (약간의 지연 후)
      setTimeout(() => {
        targetHighlight?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center',
          inline: 'nearest'
        })
      }, 100)
      
      // 3초 후 애니메이션 제거
      setTimeout(() => {
        targetHighlight?.classList.remove('flash-animation')
      }, 3000)
      
      console.log('스크롤 이동 완료')
    } else {
      console.warn('하이라이트된 텍스트를 찾을 수 없습니다:', issue.span.substring(0, 50))
      
      // 대안: 전체 텍스트에서 직접 검색해서 스크롤
      const allText = iframeDoc.body.innerText || ''
      if (allText.includes(issue.span.trim().substring(0, 20))) {
        // 대략적인 위치로 스크롤
        const range = iframeDoc.createRange()
        const walker = iframeDoc.createTreeWalker(
          iframeDoc.body,
          NodeFilter.SHOW_TEXT,
          null
        )
        
        let node
        while (node = walker.nextNode()) {
          if (node.textContent && node.textContent.includes(issue.span.trim().substring(0, 20))) {
            range.selectNode(node)
            const rect = range.getBoundingClientRect()
            if (rect.height > 0) {
              node.parentElement?.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
              })
              break
            }
          }
        }
      }
    }
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
        {!isEditing && isEditable && (
            <>
              <GuidelinesDropdown />
              <Button
                onClick={handleEdit}
                size="sm"
                variant="outline"
                className="bg-white shadow-md hover:bg-gray-50"
              >
                <Edit3 className="w-4 h-4 mr-1" />
                편집
              </Button>
              <Button
                onClick={handleValidateStart}
                disabled={isValidating}
                size="sm"
                variant="outline"
                className={`${isValidating
                  ? 'bg-purple-500 text-white cursor-not-allowed animate-pulse'
                  : 'bg-purple-600 text-white hover:bg-purple-700'
                }`}
              >
                {isValidating ? (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                    검증 중...
                  </div>
                ) : '검증'}
              </Button>

            </>
        )}

        {isEditing && (
            <div className="flex items-center gap-2">
                {/* 검증 패널 토글 버튼 - 편집 중에는 항상 표시 */}
                {hasValidationData && (
                  <Button
                    onClick={() => setShowValidationPanel(!showValidationPanel)}
                    size="sm"
                    variant="outline"
                    className={`${showValidationPanel
                      ? 'bg-orange-600 text-white hover:bg-orange-700'
                      : 'bg-white shadow-md hover:bg-gray-50'
                    }`}
                  >
                    <MapPin className="w-4 h-4 mr-1" />
                    {showValidationPanel ? '검증창 닫기' : '검증창 보기'}
                  </Button>
                )}

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
                    {isSaving ? '편집 완료 중...' : '완료'}
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

      {/* 검증 중 전체 화면 오버레이 */}
      {isValidating && (
        <div className="absolute inset-0 z-30 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-80 mx-4 text-center">
            {/* 큰 스피너 */}
            <div className="mb-6">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
            </div>
            
            {/* 메인 메시지 */}
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              문서 검증 중
            </h3>
            <p className="text-gray-600 mb-6">{validationMessage}</p>
            
            {/* 진행률 바 */}
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>진행률</span>
                <span>{validationProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${validationProgress}%` }}
                ></div>
              </div>
            </div>
            
            {/* 단계 표시 */}
            {validationStep > 0 && (
              <div className="flex justify-center items-center gap-2">
                {[1, 2, 3, 4].map((step) => (
                  <div key={step} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                      step < validationStep 
                        ? 'bg-green-500 text-white' 
                        : step === validationStep 
                        ? 'bg-blue-500 text-white animate-pulse' 
                        : 'bg-gray-200 text-gray-400'
                    }`}>
                      {step < validationStep ? '✓' : step}
                    </div>
                    {step < 4 && (
                      <div className={`w-6 h-0.5 mx-1 transition-all duration-300 ${
                        step < validationStep ? 'bg-green-500' : 'bg-gray-200'
                      }`}></div>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            {/* 단계 설명 */}
            <div className="mt-4 text-xs text-gray-500">
              {validationStep === 1 && '문서 구조를 분석하고 있습니다...'}
              {validationStep === 2 && '문서 내용을 추출하고 있습니다...'}
              {validationStep === 3 && 'AI가 검증을 수행하고 있습니다...'}
              {validationStep === 4 && '검증 결과를 처리하고 있습니다...'}
            </div>
          </div>
        </div>
      )}

      {/* 검증 완료 결과 메시지 (작은 알림) */}
      {validationMessage && !isValidating && (
        <div className={`absolute top-16 right-4 z-20 p-3 rounded-md shadow-md max-w-sm transition-all duration-300 ${
          validationMessage.includes('✅') 
            ? 'bg-green-100 text-green-800 border border-green-200'
            : validationMessage.includes('⚠️')
            ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{validationMessage}</span>
            </div>
            <button
              onClick={() => {
                hideValidationMessage()
              }}
              className="p-1 hover:bg-black hover:bg-opacity-10 rounded-md transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
          
          {validationResult && validationResult.issues.length > 0 && (
            <button
              onClick={() => setShowValidationPanel(true)}
              className="text-xs underline mt-1 block hover:text-opacity-80 flex items-center gap-1"
            >
              <MapPin className="w-3 h-3" />
              문제점 상세보기
            </button>
          )}
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

      {/* 검증 결과 상세 패널 */}
      <ValidationPanel
        isVisible={showValidationPanel}
        validationResult={validationResult}
        aiProcessingIssues={aiProcessingIssues}
        aiRevisedTexts={aiRevisedTexts}
        clickedCopyButtons={clickedCopyButtons}
        iframeRef={iframeRef}
        onClose={() => setShowValidationPanel(false)}
        onAIRevision={handleAIRevisionClick}
        onCopyText={handleCopyText}
        onNavigateToIssue={handleNavigateToIssue}
      />
      
      <iframe
        ref={iframeRef}
        key={`${sectionId}-${sectionName || 'full'}-${htmlContent.length}`}
        className={`w-full h-full border-0 transition-all duration-300 ${showValidationPanel ? 'mr-96' : ''}`}
        title="Document Content"
        sandbox="allow-same-origin allow-scripts"
        style={{ display: isLoading || hasError ? 'none' : 'block' }}
      />
    </div>
  )
}