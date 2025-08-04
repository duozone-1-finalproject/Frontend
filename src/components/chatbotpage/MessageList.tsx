import type { Message } from "../../types/index"

interface MessageListProps {
  messages: Message[]
}

export function MessageList({ messages }: MessageListProps) {
  return (
    <>
      {messages.map((message) => (
        <div key={message.id} className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
          <div
            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
              message.isUser ? "bg-blue-500 text-white" : "bg-slate-700 text-white border-slate-600"
            }`}
          >
            <p className="text-sm">{message.content}</p>
            <p className="text-xs mt-1 opacity-70">
              {message.timestamp.toLocaleTimeString("ko-KR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
      ))}
    </>
  )
}
