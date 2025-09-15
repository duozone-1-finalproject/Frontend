import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Loader2, Plus, Home } from 'lucide-react'
import { Button } from '../common/Button'
import { TableOfContents } from './table-of-contents'
import { DocumentContent } from './document-content'
import { VersionSelector } from './version-selector'
import { useDocumentViewer } from '../../hooks/dart-viewer/useDocumentViewer'
import { mockDocumentData } from '../../lib/dartViewerHelpers'

interface DocumentViewerProps {
  corpCode: string | null;
  companyName: string | null;
}

export function DocumentViewer({ corpCode, companyName }: DocumentViewerProps) {
  const navigate = useNavigate()

  const {
    selectedSection,
    setSelectedSection,
    currentSectionHTML,
    expandedSections,
    setExpandedSections,
    currentSection,
    currentVersion,
    versions,
    modifiedSections,
    isLeftPanelCollapsed,
    toggleLeftPanel,
    isCreatingVersion,
    isLoadingSection,
    handleSectionModified,
    handleCreateNewVersion,
    handleDeleteEditingVersion,
    handleDeleteVersion,
    handleSwitchVersion,
    handleVersionUpdate,
  } = useDocumentViewer(123, corpCode)

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Header */}
      <div className="bg-blue-600 text-white shadow-sm">
        <div className="px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button onClick={() => navigate('/main')} className="flex items-center space-x-2 hover:opacity-80 transition">
                <Home className="w-5 h-5" />
                <span className="text-lg font-semibold">홈</span>
              </button>
              <div className="h-5 w-px bg-blue-400"></div>
              <div className="flex items-center space-x-3">
                <span className="bg-orange-500 px-2 py-1 rounded text-xs font-medium">코스닥</span>
                <span className="font-medium">{companyName || "회사명"}</span>
                <VersionSelector
                  currentVersion={currentVersion}
                  versions={versions}
                  onVersionSelect={handleSwitchVersion}
                  onVersionDelete={handleDeleteVersion}
                  disabled={isCreatingVersion}
                />
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {modifiedSections.size > 0 && (
                <>
                  <Button
                    onClick={handleDeleteEditingVersion}
                    size="sm"
                    variant="outline"
                    className="bg-red-600 text-white hover:bg-red-700 border-red-600"
                  >
                    편집 삭제
                  </Button>
                  <Button
                    onClick={handleCreateNewVersion}
                    disabled={isCreatingVersion}
                    size="sm"
                    variant="outline"
                    className="bg-green-600 text-white hover:bg-green-700 border-green-600"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    {isCreatingVersion ? '생성 중...' : '최종 저장'}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Warning Banner */}
      <div className="bg-yellow-100 border-l-4 border-yellow-500 p-2 text-sm text-yellow-700">
        본 문서는 AI가 작성한 초안이므로, 제출 전 반드시 검토하시기 바랍니다.
        {modifiedSections.size > 0 && (
          <span className="ml-4 font-medium text-orange-600">
            ({modifiedSections.size}개 섹션이 수정됨)
          </span>
        )}
       
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Panel */}
        <div
          className={`bg-white border-r transition-all duration-200 ease-in-out ${
            isLeftPanelCollapsed ? 'w-0' : 'w-1/5'
          }`}
          style={{ minWidth: isLeftPanelCollapsed ? '0px' : '200px' }}
        >
          {!isLeftPanelCollapsed && (
            <div className="h-full flex flex-col">
              <div className="bg-blue-100 p-3 border-b flex items-center justify-between">
                <h3 className="font-semibold text-blue-800">📋 문서 목차</h3>
                <Button
                  variant="outline"
                  size="sm"
                  className="p-1 h-6 w-6 bg-white hover:bg-gray-50"
                  onClick={toggleLeftPanel}
                >
                  <ChevronLeft className="w-3 h-3" />
                </Button>
              </div>
              <div className="flex-1 overflow-auto">
                <TableOfContents
                  sections={mockDocumentData}
                  selectedSection={selectedSection}
                  onSectionSelect={setSelectedSection}
                  expandedSections={expandedSections}
                  setExpandedSections={setExpandedSections}
                  modifiedSections={modifiedSections}
                />
              </div>
            </div>
          )}
        </div>

        {/* Toggle Button - 접혔을 때만 표시 */}
        {isLeftPanelCollapsed && (
          <Button
            variant="outline"
            size="sm"
            className="absolute z-10 top-1 left-2 p-1 h-6 w-6 bg-white shadow-md hover:bg-gray-50"
            onClick={toggleLeftPanel}
          >
            <ChevronRight className="w-3 h-3" />
          </Button>
        )}

        {/* Right Panel */}
        <div className="flex-1 bg-white overflow-hidden">
          {isLoadingSection ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">섹션을 불러오는 중...</span>
            </div>
          ) : (
            <DocumentContent
              userId={123}
              corpCode={corpCode}
              companyName={companyName}
              htmlContent={currentSectionHTML}
              sectionId={selectedSection}
              sectionName={currentSection?.sectionName}
              sectionType={currentSection?.type}
              onSectionModified={handleSectionModified}
              onVersionUpdate={handleVersionUpdate}
            />
          )}
        </div>
      </div>
    </div>
  )
}