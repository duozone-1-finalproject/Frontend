export interface DocumentVersion {
  id: string
  version: number
  name: string
  content: string
  createdAt: Date
  isAutoSaved?: boolean
}

export interface VersionManagerState {
  versions: DocumentVersion[]
  currentVersionId: string | null
}
