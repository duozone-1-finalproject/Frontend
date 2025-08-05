"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Save, X } from "lucide-react"

interface VersionCreateDialogProps {
  isOpen: boolean
  onSave: (name: string) => void
  onCancel: () => void
  suggestedName?: string
}

export default function VersionCreateDialog({ isOpen, onSave, onCancel, suggestedName }: VersionCreateDialogProps) {
  const [versionName, setVersionName] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      setVersionName(suggestedName || "")
      // 다이얼로그가 열릴 때 입력 필드에 포커스
      setTimeout(() => {
        inputRef.current?.focus()
        inputRef.current?.select()
      }, 100)
    }
  }, [isOpen, suggestedName])

  const handleSave = () => {
    const name = versionName.trim()
    if (name) {
      onSave(name)
      setVersionName("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave()
    } else if (e.key === "Escape") {
      onCancel()
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* 배경 오버레이 */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-6 w-96 max-w-[90vw]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">새 버전 저장</h3>
            <Button variant="ghost" size="sm" onClick={onCancel} className="h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-3">
              편집한 내용을 새 버전으로 저장합니다. 버전 이름을 입력해주세요.
            </p>
            <Input
              ref={inputRef}
              value={versionName}
              onChange={(e) => setVersionName(e.target.value)}
              placeholder="예: 회사 정보 수정, 재무 데이터 업데이트 등"
              onKeyDown={handleKeyPress}
              className="w-full"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onCancel}>
              취소
            </Button>
            <Button onClick={handleSave} disabled={!versionName.trim()} className="flex items-center space-x-2">
              <Save className="w-4 h-4" />
              <span>저장</span>
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
