"use client"

import { Button } from "../ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Download, FileText, File } from "lucide-react"
import { handleSavePDF, handleSaveDocx } from "../../utils/saveUtils"

interface SaveDropdownProps {
  documentContent: string
  variant?: "outline" | "ghost"
  size?: "sm" | "default"
}

export function SaveDropdown({ documentContent, variant = "outline", size = "default" }: SaveDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={`flex items-center space-x-2 ${variant === "outline" ? "bg-transparent" : ""}`}
        >
          <Download className="w-4 h-4" />
          <span>저장</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => handleSavePDF(documentContent)}>
          <FileText className="h-4 w-4 mr-2" />
          PDF로 저장
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSaveDocx(documentContent)}>
          <File className="h-4 w-4 mr-2" />
          텍스트로 저장
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
