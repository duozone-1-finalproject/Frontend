"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { FileText, CheckCircle, Clock, Zap } from "lucide-react"
import type { DocumentTemplate } from "../../utils/documentTemplates"

interface DocumentGenerationLoaderProps {
  streamedContent: string
  selectedTemplate: DocumentTemplate | null
}

interface GenerationStep {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  completed: boolean
  inProgress: boolean
}

export default function DocumentGenerationLoader({ streamedContent, selectedTemplate }: DocumentGenerationLoaderProps) {
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [steps, setSteps] = useState<GenerationStep[]>([
    {
      id: "analyze",
      title: "템플릿 분석",
      description: "선택된 템플릿을 분석하고 있습니다...",
      icon: <FileText className="w-5 h-5" />,
      completed: false,
      inProgress: true,
    },
    {
      id: "structure",
      title: "문서 구조 생성",
      description: "증권신고서 구조를 생성하고 있습니다...",
      icon: <Zap className="w-5 h-5" />,
      completed: false,
      inProgress: false,
    },
    {
      id: "content",
      title: "내용 작성",
      description: "각 섹션의 내용을 작성하고 있습니다...",
      icon: <Clock className="w-5 h-5" />,
      completed: false,
      inProgress: false,
    },
    {
      id: "finalize",
      title: "최종 검토",
      description: "문서를 최종 검토하고 완성하고 있습니다...",
      icon: <CheckCircle className="w-5 h-5" />,
      completed: false,
      inProgress: false,
    },
  ])

  // 스트리밍 진행률에 따라 단계 업데이트
  useEffect(() => {
    const contentLength = streamedContent.length
    const estimatedTotalLength = 2000 // 예상 총 길이
    const newProgress = Math.min((contentLength / estimatedTotalLength) * 100, 95)
    setProgress(newProgress)

    // 진행률에 따라 현재 단계 결정
    let newCurrentStep = 0
    if (newProgress > 20) newCurrentStep = 1
    if (newProgress > 50) newCurrentStep = 2
    if (newProgress > 80) newCurrentStep = 3

    setCurrentStep(newCurrentStep)

    // 단계 상태 업데이트
    setSteps((prevSteps) =>
      prevSteps.map((step, index) => ({
        ...step,
        completed: index < newCurrentStep,
        inProgress: index === newCurrentStep,
      })),
    )
  }, [streamedContent])

  return (
    <div className="min-h-[600px] bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-8 flex flex-col items-center justify-center">
      {/* 메인 로딩 애니메이션 */}
      <div className="mb-8 text-center">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600 mx-auto mb-4"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <FileText className="w-8 h-8 text-blue-600 animate-pulse" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedTemplate?.name || "증권신고서"} 생성 중...</h2>
        <p className="text-gray-600">AI가 전문적인 증권신고서를 작성하고 있습니다</p>
      </div>

      {/* 진행률 바 */}
      <div className="w-full max-w-md mb-8">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>진행률</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500 ease-out relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-white opacity-30 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* 단계별 진행 상황 */}
      <div className="w-full max-w-lg space-y-4">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`flex items-center p-4 rounded-lg transition-all duration-300 ${
              step.completed
                ? "bg-green-50 border border-green-200"
                : step.inProgress
                  ? "bg-blue-50 border border-blue-200 shadow-md"
                  : "bg-gray-50 border border-gray-200"
            }`}
          >
            <div
              className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                step.completed
                  ? "bg-green-500 text-white"
                  : step.inProgress
                    ? "bg-blue-500 text-white animate-pulse"
                    : "bg-gray-300 text-gray-500"
              }`}
            >
              {step.completed ? <CheckCircle className="w-5 h-5" /> : step.icon}
            </div>
            <div className="flex-1">
              <h3
                className={`font-semibold ${
                  step.completed ? "text-green-800" : step.inProgress ? "text-blue-800" : "text-gray-600"
                }`}
              >
                {step.title}
              </h3>
              <p
                className={`text-sm ${
                  step.completed ? "text-green-600" : step.inProgress ? "text-blue-600" : "text-gray-500"
                }`}
              >
                {step.completed ? "완료되었습니다" : step.description}
              </p>
            </div>
            {step.inProgress && (
              <div className="flex-shrink-0">
                <div className="w-4 h-4 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin"></div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 실시간 생성 내용 미리보기 */}
      <div className="w-full max-w-2xl mt-8 bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Zap className="w-5 h-5 mr-2 text-yellow-500" />
          실시간 생성 미리보기
        </h3>
        <div className="bg-gray-50 rounded-lg p-4 max-h-40 overflow-y-auto">
          <div
            className="text-sm text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: streamedContent + '<span class="animate-pulse">|</span>',
            }}
          />
        </div>
      </div>

      {/* 생성 팁 */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500 flex items-center justify-center">
          <Clock className="w-4 h-4 mr-1" />
          평균 생성 시간: 30-60초
        </p>
      </div>
    </div>
  )
}
