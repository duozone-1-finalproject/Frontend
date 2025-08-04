"use client"

import { Button } from "../ui/button"
import { Separator } from "../ui/separator"
import {
  Bold,
  Italic,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  TableIcon,
  Plus,
  Minus,
} from "lucide-react"
import type { Editor } from "@tiptap/react"

interface EditorToolbarProps {
  editor: Editor | null
  documentContent: string
}

export function EditorToolbar({ editor, documentContent }: EditorToolbarProps) {
  if (!editor) return null

  return (
    <div className="border-b border-gray-200 p-2 flex items-center gap-1 flex-wrap bg-gray-50">
      {/* Save Dropdown */}
      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Undo/Redo */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        className="h-8 w-8 p-0"
      >
        <Undo className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        className="h-8 w-8 p-0"
      >
        <Redo className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Text Formatting */}
      <Button
        variant={editor.isActive("bold") ? "default" : "ghost"}
        size="sm"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className="h-8 w-8 p-0"
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        variant={editor.isActive("italic") ? "default" : "ghost"}
        size="sm"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className="h-8 w-8 p-0"
      >
        <Italic className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Text Alignment */}
      <div className="flex items-center gap-1">
        <span className="text-xs text-gray-600">정렬:</span>
        <Button
          variant={editor.isActive({ textAlign: "left" }) ? "default" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className="h-8 w-8 p-0"
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          variant={editor.isActive({ textAlign: "center" }) ? "default" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className="h-8 w-8 p-0"
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          variant={editor.isActive({ textAlign: "right" }) ? "default" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className="h-8 w-8 p-0"
        >
          <AlignRight className="h-4 w-4" />
        </Button>
        <Button
          variant={editor.isActive({ textAlign: "justify" }) ? "default" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          className="h-8 w-8 p-0"
        >
          <AlignJustify className="h-4 w-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Table Controls */}
      <div className="flex items-center gap-1">
        <span className="text-xs text-gray-600">표:</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
          className="h-8 w-8 p-0"
          title="표 삽입 (3x3)"
        >
          <TableIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().addColumnBefore().run()}
          disabled={!editor.can().addColumnBefore()}
          className="h-8 w-8 p-0"
          title="열 추가"
        >
          <Plus className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().deleteColumn().run()}
          disabled={!editor.can().deleteColumn()}
          className="h-8 w-8 p-0"
          title="열 삭제"
        >
          <Minus className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().addRowBefore().run()}
          disabled={!editor.can().addRowBefore()}
          className="h-8 px-2 text-xs"
          title="행 추가"
        >
          +행
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().deleteRow().run()}
          disabled={!editor.can().deleteRow()}
          className="h-8 px-2 text-xs"
          title="행 삭제"
        >
          -행
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().deleteTable().run()}
          disabled={!editor.can().deleteTable()}
          className="h-8 px-2 text-xs"
          title="표 삭제"
        >
          표삭제
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Text Colors */}
      <div className="flex items-center gap-1">
        <span className="text-xs text-gray-600">색상:</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setColor("#000000").run()}
          className="h-6 w-6 p-0 bg-black"
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setColor("#dc2626").run()}
          className="h-6 w-6 p-0 bg-red-600"
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setColor("#2563eb").run()}
          className="h-6 w-6 p-0 bg-blue-600"
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setColor("#16a34a").run()}
          className="h-6 w-6 p-0 bg-green-600"
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setColor("#ca8a04").run()}
          className="h-6 w-6 p-0 bg-yellow-600"
        />
      </div>

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Highlight Colors */}
      <div className="flex items-center gap-1">
        <span className="text-xs text-gray-600">하이라이트:</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHighlight({ color: "#fef3c7" }).run()}
          className="h-6 w-6 p-0 bg-yellow-200"
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHighlight({ color: "#fecaca" }).run()}
          className="h-6 w-6 p-0 bg-red-200"
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHighlight({ color: "#bfdbfe" }).run()}
          className="h-6 w-6 p-0 bg-blue-200"
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().unsetHighlight().run()}
          className="h-6 w-6 p-0 border border-gray-300"
        >
          <span className="text-xs">×</span>
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Headings */}
      <div className="flex items-center gap-1">
        <Button
          variant={editor.isActive("heading", { level: 1 }) ? "default" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className="h-8 px-2 text-xs"
        >
          H1
        </Button>
        <Button
          variant={editor.isActive("heading", { level: 2 }) ? "default" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className="h-8 px-2 text-xs"
        >
          H2
        </Button>
        <Button
          variant={editor.isActive("heading", { level: 3 }) ? "default" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className="h-8 px-2 text-xs"
        >
          H3
        </Button>
      </div>
    </div>
  )
}
