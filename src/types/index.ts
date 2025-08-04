export interface Message {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
}

export interface DocumentField {
  id: string
  label: string
  value: string
  placeholder: string
}

export interface DocumentVersion {
  id: string
  version: number
  content: string
  title: string
  createdAt: Date
  description?: string
}

export type Mode = "chat" | "document"
