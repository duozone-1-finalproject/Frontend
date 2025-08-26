'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import { VersionInfo } from '../../lib/dart-viewer/version-actions'
import React from 'react'

interface VersionSelectorProps {
  currentVersion: string
  versions: VersionInfo[]
  onVersionSelect: (version: string) => void
  disabled?: boolean
}

export function VersionSelector({ 
  currentVersion, 
  versions, 
  onVersionSelect, 
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
              <button
                key={version.version}
                onClick={() => handleVersionSelect(version.version)}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center justify-between ${
                  version.version === currentVersion ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                }`}
              >
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
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
