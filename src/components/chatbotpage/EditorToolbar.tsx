"use client"

import { Button } from "../ui/button"
import { Bold, Italic, AlignLeft, AlignCenter, AlignRight, Table, Undo, Redo } from "lucide-react"

interface EditorToolbarProps {
  fontSize: string
  textColor: string
  onApplyStyle: (command: string, value?: string) => void
  onApplyAlignment: (align: string) => void
  onApplyFontSize: (size: string) => void
  onApplyTextColor: (color: string) => void
  onUndo: () => void
  onRedo: () => void
}

export default function EditorToolbar({
  fontSize,
  textColor,
  onApplyStyle,
  onApplyAlignment,
  onApplyFontSize,
  onApplyTextColor,
  onUndo,
  onRedo,
}: EditorToolbarProps) {
  return (
    <>
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-700">
          💡 편집 모드: 문서의 텍스트를 선택한 뒤 위 도구를 사용해 서식을 적용하고 수정하세요.
        </p>
      </div>
      <div className="mb-4 p-2 bg-gray-100 border border-gray-300 rounded-lg flex flex-wrap gap-2">
        <Button size="sm" onClick={() => onApplyStyle("bold")} variant="outline">
          <Bold className="w-4 h-4" />
        </Button>
        <Button size="sm" onClick={() => onApplyStyle("italic")} variant="outline">
          <Italic className="w-4 h-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <Button size="sm" onClick={() => onApplyAlignment("left")} variant="outline">
          <AlignLeft className="w-4 h-4" />
        </Button>
        <Button size="sm" onClick={() => onApplyAlignment("center")} variant="outline">
          <AlignCenter className="w-4 h-4" />
        </Button>
        <Button size="sm" onClick={() => onApplyAlignment("right")} variant="outline">
          <AlignRight className="w-4 h-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* 폰트 사이즈 셀렉트 박스만 */}
        <select
          value={fontSize}
          onChange={(e) => onApplyFontSize(e.target.value)}
          className="h-8 px-2 border border-gray-300 rounded bg-white text-sm min-w-[70px]"
        >
          <option value="8px">8px</option>
          <option value="9px">9px</option>
          <option value="10px">10px</option>
          <option value="11px">11px</option>
          <option value="12px">12px</option>
          <option value="14px">14px</option>
          <option value="16px">16px</option>
          <option value="18px">18px</option>
          <option value="20px">20px</option>
          <option value="22px">22px</option>
          <option value="24px">24px</option>
          <option value="28px">28px</option>
          <option value="32px">32px</option>
          <option value="36px">36px</option>
          <option value="48px">48px</option>
          <option value="72px">72px</option>
        </select>

        <input
          type="color"
          value={textColor}
          onChange={(e) => onApplyTextColor(e.target.value)}
          className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
          title="텍스트 색상"
        />

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <Button size="sm" onClick={onUndo} variant="outline" disabled={!document.queryCommandEnabled("undo")}>
          <Undo className="w-4 h-4" />
        </Button>
        <Button size="sm" onClick={onRedo} variant="outline" disabled={!document.queryCommandEnabled("redo")}>
          <Redo className="w-4 h-4" />
        </Button>
      </div>
    </>
  )
}
