'use client'

import { ChevronDown, ChevronRight, Edit, Folder, FolderOpen, FileText } from 'lucide-react'
import React from 'react'
import { DocumentSection } from '../../types/dartViewer'

interface TableOfContentsProps {
  sections: DocumentSection[]
  selectedSection: string
  onSectionSelect: (id: string) => void
  expandedSections: Set<string>
  setExpandedSections: (sections: Set<string>) => void
  modifiedSections: Set<string>
  level?: number
}

export function TableOfContents({ 
  sections, 
  selectedSection, 
  onSectionSelect,
  expandedSections,
  setExpandedSections,
  modifiedSections,
  level = 0 
}: TableOfContentsProps) {

  const toggleExpanded = (id: string) => {
    const next = new Set(expandedSections)
    next.has(id) ? next.delete(id) : next.add(id)
    setExpandedSections(next)
  }

  return (
    <ul className={level === 0 ? '' : 'ml-4'}>
      {sections.map((section) => {
        const hasChildren = Array.isArray(section.children) && section.children.length > 0
        const isExpanded = expandedSections.has(section.id)

        return (
          <li key={section.id} className="mb-1">
            <div className="flex items-center">
              {hasChildren ? (
                <button
                  onClick={() => toggleExpanded(section.id)}
                  className="p-1 hover:bg-gray-200 rounded"
                  aria-label={isExpanded ? 'Collapse section' : 'Expand section'}
                >
                  {isExpanded ? (
                    <ChevronDown className="w-3 h-3" />
                  ) : (
                    <ChevronRight className="w-3 h-3" />
                  )}
                </button>
              ) : (
                <div className="w-5" />
              )}

              <button
                onClick={() => onSectionSelect(section.id)}
                className={`flex-1 text-left p-2 text-sm hover:bg-blue-200 rounded transition-colors flex items-center justify-between ${
                  selectedSection === section.id 
                    ? 'bg-blue-100 text-blue-700 font-medium' 
                    : 'text-gray-700'
                }`}
              >
                <span className="flex items-center flex-1 gap-2">
                  {hasChildren
                    ? (isExpanded 
                        ? <FolderOpen className="w-4 h-4 text-orange-500 drop-shadow" /> 
                        : <Folder className="w-4 h-4 text-orange-500 drop-shadow" />)
                    : <FileText className="w-4 h-4 text-gray-500" />
                  }
                  {section.title}
                </span>

                {modifiedSections.has(section.id) && (
                  <span className="flex items-center gap-1 ml-2">
                    <Edit className="w-3 h-3 text-orange-500" />
                    <span className="text-xs text-orange-600 font-medium">수정됨</span>
                  </span>
                )}
              </button>
            </div>

            {hasChildren && isExpanded && (
              <TableOfContents
                sections={section.children ?? []}  // ✅ TS 안전 처리
                selectedSection={selectedSection}
                onSectionSelect={onSectionSelect}
                expandedSections={expandedSections}
                setExpandedSections={setExpandedSections}
                modifiedSections={modifiedSections}
                level={level + 1}
              />
            )}
          </li>
        )
      })}
    </ul>
  )
}
