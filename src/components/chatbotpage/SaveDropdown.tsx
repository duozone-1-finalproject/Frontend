"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "../ui/button"
import { Save, FileText, FileDown, ChevronDown } from "lucide-react"
import { downloadAsText, downloadAsPDF, generateFilename } from "../../utils/fileExport"

interface SaveDropdownProps {
  documentContent: string
  documentRef: React.RefObject<HTMLDivElement | null>
}

export default function SaveDropdown({ documentContent, documentRef }: SaveDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // 외부 클릭시 드롭다운 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  const handleSaveAsText = () => {
    try {
      const filename = generateFilename("txt")
      downloadAsText(documentContent, filename)
      setIsOpen(false)
    } catch (error) {
      console.error("텍스트 파일 저장 중 오류:", error)
      alert("텍스트 파일 저장 중 오류가 발생했습니다.")
    }
  }

  const handleSaveAsPDF = async () => {
    if (!documentRef.current) {
      alert("문서를 찾을 수 없습니다.")
      return
    }

    setIsLoading(true)
    try {
      const filename = generateFilename("pdf")
      await downloadAsPDF(documentRef.current, filename)
      setIsOpen(false)
    } catch (error) {
      console.error("PDF 저장 중 오류:", error)
      alert("PDF 저장 중 오류가 발생했습니다. 브라우저에서 팝업을 허용해주세요.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        className="flex items-center space-x-2 bg-transparent"
        disabled={isLoading}
      >
        <Save className="w-4 h-4" />
        <span>{isLoading ? "저장 중..." : "저장하기"}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
          <div className="py-1">
            <button
              onClick={handleSaveAsText}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              disabled={isLoading}
            >
              <FileText className="w-4 h-4 mr-3" />
              텍스트 파일로 저장
            </button>

            <button
              onClick={handleSaveAsPDF}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              disabled={isLoading}
            >
              <FileDown className="w-4 h-4 mr-3" />
              PDF로 저장
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
