"use client"

import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { Card } from "./ui/card"
import { StreamingLoader } from "./streaming-loader"
import { ArrowLeft, Edit3 } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface ReportCanvasProps {
  reportContent: string
  onBack: () => void
}

export function ReportCanvas({ reportContent, onBack }: ReportCanvasProps) {
  const [isStreaming, setIsStreaming] = useState(true)
  const [displayedContent, setDisplayedContent] = useState("")
  const router = useNavigate()

  useEffect(() => {
    // 스트리밍 효과 시뮬레이션
    let index = 0
    const streamInterval = setInterval(() => {
      if (index < reportContent.length) {
        setDisplayedContent(reportContent.slice(0, index + 50))
        index += 50
      } else {
        setIsStreaming(false)
        clearInterval(streamInterval)
      }
    }, 100)

    return () => clearInterval(streamInterval)
  }, [reportContent])

  const handleEditMode = () => {
    // 생성된 리포트를 localStorage에 저장
    localStorage.setItem("generatedReport", reportContent)
    router("/editor")
  }

  return (
    <div className="space-y-6 h-full">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack} className="flex items-center gap-2 bg-transparent">
          <ArrowLeft className="w-4 h-4" />
          돌아가기
        </Button>

        {!isStreaming && (
          <Button onClick={handleEditMode} className="flex items-center gap-2">
            <Edit3 className="w-4 h-4" />
            편집하기
          </Button>
        )}
      </div>

      <Card className="p-6">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">증권신고서 자동 생성</h2>
          {isStreaming && (
            <div className="flex items-center gap-2 text-blue-600">
              <StreamingLoader />
              <span>문서를 생성하고 있습니다...</span>
            </div>
          )}
        </div>

        <div className="border rounded-lg p-6 bg-white">
          <div dangerouslySetInnerHTML={{ __html: displayedContent }} className="prose max-w-none" />
        </div>
      </Card>
    </div>
  )
}
