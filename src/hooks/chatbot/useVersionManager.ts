"use client"

import { useState, useCallback, useRef } from "react"
import type { DocumentVersion } from "../../types/version"

export function useVersionManager() {
  const [versions, setVersions] = useState<DocumentVersion[]>([])
  const [currentVersionId, setCurrentVersionId] = useState<string | null>(null)

  // Use refs to avoid dependency issues
  const versionsRef = useRef<DocumentVersion[]>([])
  const currentVersionIdRef = useRef<string | null>(null)

  // Update refs when state changes
  versionsRef.current = versions
  currentVersionIdRef.current = currentVersionId

  // 새 버전 생성
  const createVersion = useCallback((content: string, name?: string, isAutoSaved = false) => {
    const newVersion: DocumentVersion = {
      id: Date.now().toString(),
      version: versionsRef.current.length + 1,
      name: name || `버전 ${versionsRef.current.length + 1}`,
      content,
      createdAt: new Date(),
      isAutoSaved,
    }

    setVersions((prev) => [...prev, newVersion])
    setCurrentVersionId(newVersion.id)
    return newVersion
  }, [])

  // 버전 업데이트
  const updateVersion = useCallback((versionId: string, content: string, name?: string) => {
    setVersions((prev) =>
      prev.map((version) =>
        version.id === versionId
          ? {
              ...version,
              content,
              name: name || version.name,
              createdAt: new Date(),
            }
          : version,
      ),
    )
  }, [])

  // 버전 선택
  const selectVersion = useCallback((versionId: string) => {
    setCurrentVersionId(versionId)
  }, [])

  // 현재 버전 가져오기
  const getCurrentVersion = useCallback(() => {
    return versionsRef.current.find((v) => v.id === currentVersionIdRef.current) || null
  }, [])

  // 버전 삭제
  const deleteVersion = useCallback((versionId: string) => {
    setVersions((prev) => prev.filter((v) => v.id !== versionId))
    if (currentVersionIdRef.current === versionId) {
      const remainingVersions = versionsRef.current.filter((v) => v.id !== versionId)
      setCurrentVersionId(remainingVersions.length > 0 ? remainingVersions[remainingVersions.length - 1].id : null)
    }
  }, [])

  // 버전 이름 변경
  const renameVersion = useCallback((versionId: string, newName: string) => {
    setVersions((prev) => prev.map((version) => (version.id === versionId ? { ...version, name: newName } : version)))
  }, [])

  // 자동 버전 이름 생성
  const generateVersionName = useCallback(() => {
    const now = new Date()
    const timeString = now.toLocaleString("ko-KR", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
    return `편집본 ${timeString}`
  }, [])

  // 내용이 변경되었는지 확인
  const hasContentChanged = useCallback((newContent: string) => {
    const currentVersion = versionsRef.current.find((v) => v.id === currentVersionIdRef.current)
    return currentVersion ? currentVersion.content !== newContent : true
  }, [])

  // 버전 초기화 (템플릿 변경 시 사용)
  const resetVersions = useCallback(() => {
    setVersions([])
    setCurrentVersionId(null)
  }, [])

  return {
    versions,
    currentVersionId,
    createVersion,
    updateVersion,
    selectVersion,
    getCurrentVersion,
    deleteVersion,
    renameVersion,
    generateVersionName,
    hasContentChanged,
    resetVersions,
  }
}
