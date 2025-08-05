"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { ChevronDown, Clock, Edit2, Trash2, Plus } from "lucide-react"
import type { DocumentVersion } from "../../types/version"

interface VersionSelectorProps {
  versions: DocumentVersion[]
  currentVersionId: string | null
  onSelectVersion: (versionId: string) => void
  onCreateVersion: (name: string) => void
  onRenameVersion: (versionId: string, newName: string) => void
  onDeleteVersion: (versionId: string) => void
}

export default function VersionSelector({
  versions,
  currentVersionId,
  onSelectVersion,
  onCreateVersion,
  onRenameVersion,
  onDeleteVersion,
}: VersionSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [newVersionName, setNewVersionName] = useState("")
  const [editingVersionId, setEditingVersionId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState("")
  const dropdownRef = useRef<HTMLDivElement>(null)

  const currentVersion = versions.find((v) => v.id === currentVersionId)

  // 외부 클릭시 드롭다운 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setIsCreating(false)
        setEditingVersionId(null)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  const handleCreateVersion = () => {
    if (newVersionName.trim()) {
      onCreateVersion(newVersionName.trim())
      setNewVersionName("")
      setIsCreating(false)
      setIsOpen(false)
    }
  }

  const handleRename = (versionId: string) => {
    if (editingName.trim()) {
      onRenameVersion(versionId, editingName.trim())
      setEditingVersionId(null)
      setEditingName("")
    }
  }

  const startEditing = (version: DocumentVersion) => {
    setEditingVersionId(version.id)
    setEditingName(version.name)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        className="flex items-center space-x-2 bg-transparent min-w-[150px] justify-between"
      >
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4" />
          <span className="truncate">{currentVersion ? currentVersion.name : "버전 선택"}</span>
        </div>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="p-2 border-b border-gray-100">
            {isCreating ? (
              <div className="flex items-center space-x-2">
                <Input
                  value={newVersionName}
                  onChange={(e) => setNewVersionName(e.target.value)}
                  placeholder="버전 이름을 입력하세요"
                  className="flex-1 h-8 text-sm"
                  onKeyPress={(e) => e.key === "Enter" && handleCreateVersion()}
                  autoFocus
                />
                <Button size="sm" onClick={handleCreateVersion} disabled={!newVersionName.trim()}>
                  저장
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setIsCreating(false)}>
                  취소
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => setIsCreating(true)}
                variant="ghost"
                size="sm"
                className="w-full flex items-center justify-center space-x-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              >
                <Plus className="w-4 h-4" />
                <span>새 버전 생성</span>
              </Button>
            )}
          </div>

          <div className="py-1">
            {versions.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">저장된 버전이 없습니다</div>
            ) : (
              versions
                .slice()
                .reverse()
                .map((version) => (
                  <div
                    key={version.id}
                    className={`px-3 py-2 hover:bg-gray-50 ${
                      version.id === currentVersionId ? "bg-blue-50 border-l-2 border-blue-500" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        {editingVersionId === version.id ? (
                          <div className="flex items-center space-x-2">
                            <Input
                              value={editingName}
                              onChange={(e) => setEditingName(e.target.value)}
                              className="flex-1 h-6 text-sm"
                              onKeyPress={(e) => e.key === "Enter" && handleRename(version.id)}
                              onBlur={() => handleRename(version.id)}
                              autoFocus
                            />
                          </div>
                        ) : (
                          <button
                            onClick={() => onSelectVersion(version.id)}
                            className="w-full text-left"
                            disabled={version.id === currentVersionId}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium text-sm truncate">{version.name}</div>
                                <div className="text-xs text-gray-500">
                                  v{version.version} • {version.createdAt.toLocaleString("ko-KR")}
                                  {version.isAutoSaved && " • 자동저장"}
                                </div>
                              </div>
                            </div>
                          </button>
                        )}
                      </div>

                      {editingVersionId !== version.id && (
                        <div className="flex items-center space-x-1 ml-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation()
                              startEditing(version)
                            }}
                            className="h-6 w-6 p-0 hover:bg-gray-200"
                          >
                            <Edit2 className="w-3 h-3" />
                          </Button>
                          {versions.length > 1 && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation()
                                if (window.confirm("이 버전을 삭제하시겠습니까?")) {
                                  onDeleteVersion(version.id)
                                }
                              }}
                              className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
