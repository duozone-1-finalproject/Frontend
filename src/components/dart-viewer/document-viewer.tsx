import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Loader2, Plus, Home } from 'lucide-react'
import { Button } from './ui/button'
import { TableOfContents } from './table-of-contents'
import { DocumentContent } from './document-content'
import { VersionSelector } from './version-selector'
import {
  createNewVersion,
  getVersionSections,
  loadFullProjectState,
  type VersionInfo
} from '../../lib/dart-viewer/version-actions'
import { mockDocumentData, getSectionKeyFromId, findSectionById } from '../../data/dart-viewer/mockDocumentData'
import React from 'react'
import axios from '../../api/axios'


export function DocumentViewer() {
  const navigate = useNavigate()

  const [selectedSection, setSelectedSection] = useState<string>(() => {
    const saved = localStorage.getItem("selectedSection")
    return saved ?? "1"
  })

  const [isLeftPanelCollapsed, setIsLeftPanelCollapsed] = useState(false)
  const [currentVersion, setCurrentVersion] = useState('v0')
  const [versions, setVersions] = useState<VersionInfo[]>([])
  const [modifiedSections, setModifiedSections] = useState<Set<string>>(new Set())
  const [isCreatingVersion, setIsCreatingVersion] = useState(false)
  const [currentSectionHTML, setCurrentSectionHTML] = useState<string>('')
  const [isLoadingSection, setIsLoadingSection] = useState(false)
  const [versionSectionsData, setVersionSectionsData] = useState<Record<string, string>>({})
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['3', '6', '7', '14', '21', '22', '28', '36', '47', '50', '55', '60', '66'])
  )

  useEffect(() => {
    if (selectedSection) {
      localStorage.setItem('selectedSection', selectedSection)
    }
  })

  useEffect(() => {
    const loadProjectState = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const state = await loadFullProjectState(123456, token);

        setCurrentVersion(state.currentVersion)
        setVersions(state.versions)
        setModifiedSections(state.modifiedSections)
        setVersionSectionsData(state.sectionsData)
      } catch (error) {
        console.error('프로젝트 상태 로드 오류:', error)
      }
    }
    
    loadProjectState()
  }, [])

  useEffect(() => {
    if (!selectedSection || !versionSectionsData) return

    const sectionKey = getSectionKeyFromId(selectedSection)
    setCurrentSectionHTML(versionSectionsData[sectionKey] ?? "")
  }, [selectedSection, versionSectionsData])


  const currentSection = useMemo(
    () => findSectionById(mockDocumentData, selectedSection),
    [selectedSection]
  )

  const toggleLeftPanel = () => {
    setIsLeftPanelCollapsed(!isLeftPanelCollapsed)
  }

  const handleSectionModified = async (sectionId: string, updatedHTML: string) => {
    const newModifiedSections = new Set([...modifiedSections, sectionId])
    setModifiedSections(newModifiedSections)

    try {
      await axios.patch('/api/versions/editing', {
        user_id: 123456,
        modifiedSections: Array.from(newModifiedSections)
      })
    } catch (error) {
      console.error("수정된 섹션 상태 업데이트 오류:", error);
    }

    const sectionKey = getSectionKeyFromId(sectionId)
    setVersionSectionsData(prev => ({ ...prev, [sectionKey]: updatedHTML }))

    if (sectionId === selectedSection) {
      setCurrentSectionHTML(updatedHTML)
    }
  }

  const handleCreateNewVersion = async () => {
    if (modifiedSections.size === 0) {
      alert('수정된 섹션이 없습니다.')
      return
    }
    setIsCreatingVersion(true)
    try {
      const description = prompt('새 버전에 대한 설명을 입력하세요:')
      const token = localStorage.getItem("accessToken"); 
      const result = await createNewVersion(123456, description || undefined, token); 
      
      if (result.success) {
        localStorage.removeItem('selectedSection')
        
        const state = await loadFullProjectState(123456, token);
        setCurrentVersion(state.currentVersion)
        setModifiedSections(state.modifiedSections)
        setVersions(state.versions)
        setVersionSectionsData(state.sectionsData)

        alert(result.message)
      } else {
        alert(result.message)
      }
    } catch (error) {
      console.error('새 버전 생성 오류:', error)
      alert('새 버전 생성 중 오류가 발생했습니다.')
    } finally {
      setIsCreatingVersion(false)
      window.location.reload();
    }
  }

  const handleDeleteEditingVersion = async () => {
    if (!window.confirm("편집중인 버전을 삭제하시겠습니까?")) return;
    try {
      const response = await axios.delete("/api/versions/editing", {
        data: {
          user_id: 123456,
        }
      });
      alert(response.data);
      localStorage.removeItem("selectedSection");
      window.location.reload();
    } catch (err: any) {
      console.error(err);
      const errorMessage = err.response?.data || "삭제 중 오류가 발생했습니다.";
      alert(errorMessage);
    }
  }

  const handleSwitchVersion = async (version: string) => {
    if (version === currentVersion) return
    if (modifiedSections.size > 0) {
      const confirm = window.confirm('저장되지 않은 변경사항이 있습니다. 계속하시겠습니까?')
      if (!confirm) return
    }
    setIsLoadingSection(true)
    try {
      setCurrentVersion(version)
      setModifiedSections(new Set())

      const token = localStorage.getItem("accessToken"); 
      const sectionsData = await getVersionSections(version, 123456, token);
      setVersionSectionsData(sectionsData)

      const selectedSectionKey = getSectionKeyFromId(selectedSection)
      if (selectedSectionKey && sectionsData[selectedSectionKey]) {
        setCurrentSectionHTML(sectionsData[selectedSectionKey])
      }

    } catch (error) {
      console.error('버전 전환 오류:', error)
      alert('버전 전환 중 오류가 발생했습니다.')
    } finally {
      setIsLoadingSection(false)
    }
  }

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
                <span className="font-medium">오픈엣지테크놀로지</span>
                <VersionSelector
                  currentVersion={currentVersion}
                  versions={versions}
                  onVersionSelect={handleSwitchVersion}
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
              <div className="bg-blue-100 p-3 border-b text-center">
                <h3 className="font-semibold text-blue-800">📑 문서 목차</h3>
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

        {/* Toggle Button */}
        <Button
          variant="outline"
          size="sm"
          className={`absolute z-10 transform -translate-y-1/2 transition-all duration-200`}
          style={{
            left: isLeftPanelCollapsed ? '8px' : 'calc(20% + 4px)',
            top: '25px', 
          }}
          onClick={toggleLeftPanel}
        >
          {isLeftPanelCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>

        {/* Right Panel */}
        <div className="flex-1 bg-white overflow-hidden">
          {isLoadingSection ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">섹션을 불러오는 중...</span>
            </div>
          ) : (
            <DocumentContent
              userId={123456}
              htmlContent={currentSectionHTML}
              sectionId={selectedSection}
              sectionName={currentSection?.sectionName}
              sectionType={currentSection?.type}
              onSectionModified={handleSectionModified}
              modifiedSections={modifiedSections}
            />
          )}
        </div>
      </div>
    </div>
  )
}