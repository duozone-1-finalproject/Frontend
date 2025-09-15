'use client'

import { X, AlertCircle, Wand2, Loader2, Copy, ChevronRight } from 'lucide-react'
import { ValidationResponse, ValidationIssue } from '../../types/dartViewer'

interface ValidationPanelProps {
  isVisible: boolean
  validationResult: ValidationResponse | null
  aiProcessingIssues: Set<number>
  aiRevisedTexts: Record<number, string>
  clickedCopyButtons: Set<number>
  iframeRef: React.RefObject<HTMLIFrameElement | null>
  onClose: () => void
  onAIRevision: (issue: ValidationIssue, index: number) => Promise<void>
  onCopyText: (text: string, index: number) => void
  onNavigateToIssue: (issue: ValidationIssue, index: number) => void
}

export function ValidationPanel({
  isVisible,
  validationResult,
  aiProcessingIssues,
  aiRevisedTexts,
  clickedCopyButtons,
  iframeRef,
  onClose,
  onAIRevision,
  onCopyText,
  onNavigateToIssue
}: ValidationPanelProps) {
  if (!isVisible || !validationResult) return null

  return (
    <div className="absolute top-16 right-0 bottom-0 z-40 w-96 bg-white shadow-2xl border-l border-gray-200 transform transition-transform duration-300">
      <div className="h-full flex flex-col">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-red-50">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <h3 className="font-semibold text-gray-800">검증 결과</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-red-100 rounded-md transition-colors"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* 요약 정보 */}
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>심각: {validationResult.issues.filter(i => i.severity === 'high').length}개</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span>보통: {validationResult.issues.filter(i => i.severity === 'medium').length}개</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span>경미: {validationResult.issues.filter(i => i.severity === 'low').length}개</span>
            </div>
          </div>
        </div>

        {/* 문제점 목록 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {validationResult.issues.map((issue, index) => (
            <ValidationIssueCard
              key={index}
              issue={issue}
              index={index}
              isProcessing={aiProcessingIssues.has(index)}
              revisedText={aiRevisedTexts[index]}
              isCopyClicked={clickedCopyButtons.has(index)}
              onAIRevision={() => onAIRevision(issue, index)}
              onCopyText={(text) => onCopyText(text, index)}
              onNavigateToIssue={() => onNavigateToIssue(issue, index)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

interface ValidationIssueCardProps {
  issue: ValidationIssue
  index: number
  isProcessing: boolean
  revisedText?: string
  isCopyClicked: boolean
  onAIRevision: () => Promise<void>
  onCopyText: (text: string) => void
  onNavigateToIssue: () => void
}

function ValidationIssueCard({
  issue,
  index,
  isProcessing,
  revisedText,
  isCopyClicked,
  onAIRevision,
  onCopyText,
  onNavigateToIssue
}: ValidationIssueCardProps) {
  return (
    <div className={`border rounded-lg p-4 ${
      issue.severity === 'high' ? 'border-red-200 bg-red-50' :
      issue.severity === 'medium' ? 'border-orange-200 bg-orange-50' :
      'border-yellow-200 bg-yellow-50'
    }`}>
      {/* 심각도 배지 및 AI 수정 버튼 */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            issue.severity === 'high' ? 'bg-red-100 text-red-800' :
            issue.severity === 'medium' ? 'bg-orange-100 text-orange-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {issue.severity === 'high' ? '심각' : issue.severity === 'medium' ? '보통' : '경미'}
          </span>
          <span className="text-xs text-gray-500">문제 {index + 1}</span>
        </div>
        
        {/* AI 수정 버튼 */}
        <button
          onClick={onAIRevision}
          disabled={isProcessing}
          className={`flex items-center gap-1 px-2 py-1 text-xs rounded-md transition-colors ${
            isProcessing
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
          }`}
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-3 h-3 animate-spin" />
              처리중
            </>
          ) : (
            <>
              <Wand2 className="w-3 h-3" />
              AI 수정
            </>
          )}
        </button>
      </div>

      {/* 문제 텍스트 */}
      <div className="mb-3">
        <h4 className="text-sm font-medium text-gray-800 mb-1">문제 위치:</h4>
        <div className="bg-white border rounded p-2 text-sm font-mono text-gray-700 max-h-20 overflow-y-auto">
          "{issue.span}"
        </div>
      </div>

      {/* 이유 */}
      <div className="mb-3">
        <h4 className="text-sm font-medium text-gray-800 mb-1">문제 이유:</h4>
        <p className="text-sm text-gray-600">{issue.reason}</p>
      </div>

      {/* 제안 */}
      <div className="mb-3">
        <h4 className="text-sm font-medium text-gray-800 mb-1">개선 제안:</h4>
        <p className="text-sm text-green-700">{issue.suggestion}</p>
      </div>

      {/* 증거 */}
      {issue.evidence && (
        <div className="mb-3">
          <h4 className="text-sm font-medium text-gray-800 mb-1">근거:</h4>
          <p className="text-xs text-gray-500">{issue.evidence}</p>
        </div>
      )}

      {/* AI 개선된 텍스트 */}
      {revisedText && (
        <div className="mb-3 bg-green-50 border border-green-200 rounded-lg p-3 relative">
          <h4 className="text-sm font-medium text-green-800 mb-2 flex items-center gap-1">
            <Wand2 className="w-4 h-4" />
            AI 개선된 텍스트:
          </h4>
          <div className="bg-white border rounded p-2 text-sm text-gray-700 max-h-32 overflow-y-auto">
            "{revisedText}"
          </div>
          
          {/* 우측 상단 복사 버튼 */}
          <button
            onClick={() => onCopyText(revisedText)}
            className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:text-gray-800 hover:bg-green-100 rounded transition-all duration-150 border bg-white shadow-sm"
          >
            <Copy className="w-3 h-3" />
            <span>{isCopyClicked ? '복사됨' : '복사'}</span>
          </button>
        </div>
      )}

      {/* 문제 위치로 이동 버튼 */}
      <button 
        className={`w-full mt-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
          issue.severity === 'high' ? 'bg-red-600 hover:bg-red-700 text-white' :
          issue.severity === 'medium' ? 'bg-orange-600 hover:bg-orange-700 text-white' :
          'bg-yellow-600 hover:bg-yellow-700 text-white'
        }`}
        onClick={onNavigateToIssue}
      >
        <ChevronRight className="w-4 h-4 inline mr-1" />
        문제 위치로 이동
      </button>
    </div>
  )
}