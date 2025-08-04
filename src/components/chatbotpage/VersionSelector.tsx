"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Badge } from "../ui/badge"
import { Clock } from "lucide-react"
import type { DocumentVersion } from "../../types"

interface VersionSelectorProps {
  versions: DocumentVersion[]
  currentVersionId: string | null
  onVersionSelect: (version: DocumentVersion) => void
  hasUnsavedChanges: boolean
}

export function VersionSelector({
  versions,
  currentVersionId,
  onVersionSelect,
  hasUnsavedChanges,
}: VersionSelectorProps) {
  const sortedVersions = [...versions].sort((a, b) => b.version - a.version)
  const currentVersion = versions.find((v) => v.id === currentVersionId)

  if (versions.length === 0) {
    return null
  }

  return (
    <div className="flex items-center gap-2">
      <Select
        value={currentVersionId || ""}
        onValueChange={(versionId) => {
          const selectedVersion = versions.find((v) => v.id === versionId)
          if (selectedVersion) {
            onVersionSelect(selectedVersion)
          }
        }}
      >
        <SelectTrigger className="w-32 h-9">
          <SelectValue>
            <div className="flex items-center gap-2">
              <span className="text-sm">v{currentVersion?.version || 1}</span>
              {hasUnsavedChanges && <div className="w-2 h-2 bg-amber-500 rounded-full" />}
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {sortedVersions.map((version) => (
            <SelectItem key={version.id} value={version.id}>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    v{version.version}
                  </Badge>
                  <span className="text-sm">{version.title}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500 ml-2">
                  <Clock className="w-3 h-3" />
                  {version.createdAt.toLocaleString("ko-KR", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
