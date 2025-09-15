'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check, Trash2 } from 'lucide-react'
import { VersionInfo } from '../../types/dartViewer'
import React from 'react'

interface VersionSelectorProps {
  currentVersion: string
  versions: VersionInfo[]
  onVersionSelect: (version: string) => void
  onVersionDelete?: (version: string) => void
  disabled?: boolean
}

export function VersionSelector({
  currentVersion,
  versions,
  onVersionSelect,
  onVersionDelete,
  disabled = false
}: VersionSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleVersionSelect = (version: string) => {
    if (version !== currentVersion && !disabled) {
      onVersionSelect(version)
    }
    setIsOpen(false)
  }

  const handleVersionDelete = (e: React.MouseEvent, version: string) => {
    e.stopPropagation() // 버전 선택 이벤트와 분리

    if (version === 'v0') {
      alert('v0은 초기 버전으로 삭제할 수 없습니다.')
      return
    }

    if (window.confirm(`버전 ${version}을(를) 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`)) {
      onVersionDelete?.(version)
      setIsOpen(false)
    }
  }

  const currentVersionInfo = versions.find(v => v.version === currentVersion)

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`flex items-center gap-2 px-3 py-1.5 bg-white text-blue-600 border border-white rounded hover:bg-blue-50 transition-colors ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        }`}
      >
        <span className="font-medium">{currentVersion}</span>
        {currentVersionInfo?.description && (
          <span className="text-xs text-blue-500">
            - {currentVersionInfo.description}
          </span>
        )}
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 min-w-[200px]">
          <div className="py-1">
            {versions.map((version) => (
              <div
                key={version.version}
                className={`flex items-center justify-between hover:bg-gray-100 ${
                  version.version === currentVersion ? 'bg-blue-50' : ''
                }`}
              >
                <button
                  onClick={() => handleVersionSelect(version.version)}
                  className={`flex-1 text-left px-3 py-2 text-sm ${
                    version.version === currentVersion ? 'text-blue-700' : 'text-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="font-medium">{version.version}</span>
                      {version.description && (
                        <span className="text-xs text-gray-500">{version.description}</span>
                      )}
                      <span className="text-xs text-gray-400">
                        {new Date(version.createdAt).toLocaleDateString('ko-KR')}
                      </span>
                    </div>
                    {version.version === currentVersion && (
                      <Check className="w-4 h-4 text-blue-600" />
                    )}
                  </div>
                </button>

                {/* 삭제 버튼 - v0이 아닐 때만 표시 */}
                {version.version !== 'v0' && onVersionDelete && (
                  <button
                    onClick={(e) => handleVersionDelete(e, version.version)}
                    className="px-2 py-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-r transition-colors"
                    title={`버전 ${version.version} 삭제`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
