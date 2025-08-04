import type { DocumentVersion } from "../types"

export const createNewVersion = (
  content: string,
  existingVersions: DocumentVersion[],
  title?: string,
  description?: string,
): DocumentVersion => {
  const nextVersion = existingVersions.length + 1

  return {
    id: `v${nextVersion}-${Date.now()}`,
    version: nextVersion,
    content,
    title: title || `증권신고서 v${nextVersion}`,
    createdAt: new Date(),
    description: description || `버전 ${nextVersion} - ${new Date().toLocaleString("ko-KR")}`,
  }
}

export const getVersionSummary = (content: string, maxLength = 100): string => {
  // HTML 태그 제거
  const textContent = content.replace(/<[^>]*>/g, "").trim()

  if (textContent.length <= maxLength) {
    return textContent
  }

  return textContent.substring(0, maxLength) + "..."
}

export const saveVersionsToStorage = (versions: DocumentVersion[]) => {
  try {
    localStorage.setItem("document-versions", JSON.stringify(versions))
  } catch (error) {
    console.error("Failed to save versions to storage:", error)
  }
}

export const loadVersionsFromStorage = (): DocumentVersion[] => {
  try {
    const stored = localStorage.getItem("document-versions")
    if (stored) {
      const parsed = JSON.parse(stored)
      // Date 객체 복원
      return parsed.map((version: any) => ({
        ...version,
        createdAt: new Date(version.createdAt),
      }))
    }
  } catch (error) {
    console.error("Failed to load versions from storage:", error)
  }
  return []
}

export const deleteVersion = (versionId: string, versions: DocumentVersion[]): DocumentVersion[] => {
  return versions.filter((v) => v.id !== versionId)
}
