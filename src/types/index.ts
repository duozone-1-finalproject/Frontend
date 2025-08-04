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

export type Mode = "chat" | "document"
