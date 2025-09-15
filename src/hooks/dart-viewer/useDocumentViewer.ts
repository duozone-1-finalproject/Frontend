import { useEffect, useMemo, useState, useCallback } from "react";
import { mockDocumentData, getSectionKeyFromId, findSectionById } from "../../lib/dartViewerHelpers";
import type { VersionInfo } from "../../types/dartViewer";
import { dartViewerApi } from "../../api/dartViewerApi";
import { loadFullProjectState, getVersionSections, createNewVersion } from "../../service/dartViewerService";

export function useDocumentViewer(userId: number, corpCode: string | null) {

  // State
  const [selectedSection, setSelectedSection] = useState<string>(() => {
    const saved = localStorage.getItem("selectedSection");
    return saved ?? "1";
  });

  const [isLeftPanelCollapsed, setIsLeftPanelCollapsed] = useState(false);
  const [currentVersion, setCurrentVersion] = useState("v0");
  const [versions, setVersions] = useState<VersionInfo[]>([]);
  const [modifiedSections, setModifiedSections] = useState<Set<string>>(new Set());
  const [isCreatingVersion, setIsCreatingVersion] = useState(false);
  const [currentSectionHTML, setCurrentSectionHTML] = useState<string>("");
  const [isLoadingSection, setIsLoadingSection] = useState(false);
  const [versionSectionsData, setVersionSectionsData] = useState<Record<string, string>>({});
  // Section-specific data cache to handle same sectionKey sections
  const [sectionSpecificData, setSectionSpecificData] = useState<Record<string, string>>({});
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["3", "6", "7", "14", "21", "22", "28", "36", "47", "50", "55", "60", "66"])
  );

  // Save selected section
  useEffect(() => {
    if (selectedSection) {
      localStorage.setItem("selectedSection", selectedSection);
    }
  }, [selectedSection]);

  // Load initial project state
  useEffect(() => {
    const loadProjectState = async () => {
      try {
        if (!corpCode) return;
        const state = await loadFullProjectState(userId, corpCode);

        setCurrentVersion(state.currentVersion);
        setVersions(state.versions);
        setModifiedSections(state.modifiedSections);
        setVersionSectionsData(state.sectionsData);
        setSectionSpecificData({}); // Initialize section-specific cache
        
      } catch (error) {
        console.error("❌ [useDocumentViewer] 프로젝트 상태 로드 오류:", error);
      }
    };

    loadProjectState();
  }, [userId, corpCode]);

  // Sync current section HTML with section-specific data priority
  useEffect(() => {
    if (!selectedSection || !versionSectionsData) {
      return;
    }

    const sectionKey = getSectionKeyFromId(selectedSection);
    const sectionSpecificKey = `${sectionKey}-${selectedSection}`;
    
    // Check section-specific data first, then fall back to general section data
    const htmlContent = sectionSpecificData[sectionSpecificKey] ?? versionSectionsData[sectionKey] ?? "";
    
    setCurrentSectionHTML(htmlContent);
  }, [selectedSection, versionSectionsData, sectionSpecificData]);

  const currentSection = findSectionById(mockDocumentData, selectedSection);

  const toggleLeftPanel = () => setIsLeftPanelCollapsed((prev) => !prev);

  const handleSectionModified = useCallback(async (sectionId: string, updatedHTML: string) => {
    const newModifiedSections = new Set([...modifiedSections, sectionId]);
    setModifiedSections(newModifiedSections);

    try {
      if (!corpCode) return;
      await dartViewerApi.patchEditingVersion({
        user_id: userId,
        corp_code: corpCode,
        modifiedSections: Array.from(newModifiedSections)
      });
      
      const sectionKey = getSectionKeyFromId(sectionId);
      const sectionSpecificKey = `${sectionKey}-${sectionId}`;
      
      // Store in section-specific data to avoid conflicts
      setSectionSpecificData((prev) => ({ 
        ...prev, 
        [sectionSpecificKey]: updatedHTML 
      }));
      
      // Also update the general section data for consistency
      setVersionSectionsData((prev) => ({ ...prev, [sectionKey]: updatedHTML }));

      if (sectionId === selectedSection) {
        setCurrentSectionHTML(updatedHTML);
      }
    } catch (error) {
      console.error("섹션 상태 업데이트 오류:", error);
      // Revert the modified sections on error
      setModifiedSections(modifiedSections);
    }
  }, [userId, modifiedSections, selectedSection]);

  const handleCreateNewVersion = useCallback(async () => {
    if (modifiedSections.size === 0) {
      alert("수정된 섹션이 없습니다.");
      return;
    }
    
    setIsCreatingVersion(true);
    
    try {
      const description = prompt("새 버전에 대한 설명을 입력하세요:");
      if (description === null) {
        setIsCreatingVersion(false);
        return; // User cancelled
      }
      
      if (!corpCode) return;
      const result = await createNewVersion(userId, corpCode, description || undefined);

      if (result.success) {
        localStorage.removeItem("selectedSection");
        
        // Reload state and clear section-specific cache
        if (!corpCode) return;
        const state = await loadFullProjectState(userId, corpCode);
        setCurrentVersion(state.currentVersion);
        setModifiedSections(state.modifiedSections);
        setVersions(state.versions);
        setVersionSectionsData(state.sectionsData);
        setSectionSpecificData({}); // Clear section-specific cache

        alert(result.message);
        setTimeout(() => window.location.reload(), 1000);
      } else {
        alert(result.message);
        setIsCreatingVersion(false);
      }
    } catch (error) {
      console.error("새 버전 생성 오류:", error);
      alert("새 버전 생성 중 오류가 발생했습니다.");
      setIsCreatingVersion(false);
    }
  }, [modifiedSections, userId]);

  const handleDeleteEditingVersion = useCallback(async () => {
    if (!window.confirm("편집중인 버전을 삭제하시겠습니까?")) return;

    try {
      if (!corpCode) return;
      await dartViewerApi.deleteVersion({ user_id: userId, corp_code: corpCode, version: currentVersion });
      alert("삭제가 완료되었습니다!");
      localStorage.removeItem("selectedSection");
      setTimeout(() => window.location.reload(), 1000);
    } catch (err: any) {
      console.error(err);
      const errorMessage = err.response?.data?.message || err.message || "삭제 중 오류가 발생했습니다.";
      alert(errorMessage);
    }
  }, [userId, corpCode, currentVersion]);

  const handleVersionUpdate = useCallback(() => {
    setCurrentVersion("editing");
  }, []);

  const handleSwitchVersion = useCallback(async (version: string) => {
    if (version === currentVersion) return;
    
    if (modifiedSections.size > 0) {
      const confirm = window.confirm("저장되지 않은 변경사항이 있습니다. 계속하시겠습니까?");
      if (!confirm) return;
    }
    
    setIsLoadingSection(true);
    
    try {
      // 전체 프로젝트 상태를 다시 로드하여 정확한 modifiedSections를 가져옴
      if (!corpCode) return;
      const fullState = await loadFullProjectState(userId, corpCode);
      
      // 섹션 데이터 로드
      const sectionsData = await getVersionSections(version, userId, corpCode);
      
      // 모든 상태를 한번에 업데이트하여 렌더링 최적화
      setCurrentVersion(version);
      setVersions(fullState.versions);
      setVersionSectionsData(sectionsData);
      setSectionSpecificData({}); // Clear section-specific cache when switching versions
      
      // 버전에 따라 적절한 modifiedSections 설정
      if (version === 'editing') {
        setModifiedSections(fullState.modifiedSections);
      } else {
        setModifiedSections(new Set());
      }

      // Update current section HTML
      const selectedSectionKey = getSectionKeyFromId(selectedSection);
      if (selectedSectionKey && sectionsData[selectedSectionKey]) {
        setCurrentSectionHTML(sectionsData[selectedSectionKey]);
      } else {
        setCurrentSectionHTML("");
      }
    } catch (error) {
      console.error("버전 전환 오류:", error);
      alert("버전 전환 중 오류가 발생했습니다.");
      // Don't change version on error
    } finally {
      setIsLoadingSection(false);
    }
  }, [userId, modifiedSections, selectedSection, currentVersion]);

  // 버전 삭제 핸들러
  const handleDeleteVersion = useCallback(async (versionToDelete: string) => {
    if (!corpCode) {
      alert('corpCode가 필요합니다.');
      return;
    }

    if (versionToDelete === 'v0') {
      alert('v0은 초기 버전으로 삭제할 수 없습니다.');
      return;
    }

    try {
      await dartViewerApi.deleteVersion({ user_id: userId, corp_code: corpCode, version: versionToDelete });

      // 버전 목록 새로고침
      const state = await loadFullProjectState(userId, corpCode);
      setVersions(state.versions);
      setModifiedSections(state.modifiedSections);
      setVersionSectionsData(state.sectionsData);

      alert(`버전 ${versionToDelete}이 성공적으로 삭제되었습니다.`);
      window.location.reload();
    } catch (error: any) {
      console.error('버전 삭제 오류:', error);
      alert('버전 삭제 중 오류가 발생했습니다.');
    }
  }, [userId, corpCode, currentVersion]);

  return {
    // Section state
    selectedSection,
    setSelectedSection,
    currentSectionHTML,
    expandedSections,
    setExpandedSections,
    currentSection,
    
    // Version state
    currentVersion,
    versions,
    modifiedSections,
    versionSectionsData,
    
    // UI state
    isLeftPanelCollapsed,
    toggleLeftPanel,
    isCreatingVersion,
    isLoadingSection,
    
    // Template data는 더 이상 필요하지 않음 (DB에서 직접 HTML 로드)
    
    // Actions
    handleSectionModified,
    handleCreateNewVersion,
    handleDeleteEditingVersion,
    handleDeleteVersion,
    handleSwitchVersion,
    handleVersionUpdate,
  };
}