// Dart Viewer Service - 버전 및 문서 관리 서비스
import { initializeData, createPayload, mergeAndFormatSection } from "../lib/dart-viewer/dartViewerHelpers"
import { DBVersionData, ProjectState, VersionInfo } from "../types/dartViewer";
import { dartViewerApi } from "../api/dartViewerApi";


export async function fetchVersionsFromDB(userId: number): Promise<DBVersionData> {
  try {
    const response = await dartViewerApi.fetchVersions(userId);
    return response;
  } catch (error) {
    console.error('DB에서 버전 데이터 가져오기 오류:', error);
    throw error;
  }
}

export async function initializeProject(userId: number) {
  try {
    const versionsData = await fetchVersionsFromDB(userId)

    if (versionsData.v0) {
      return versionsData
    }

    const initialData = await initializeData()
    const payload = createPayload({
      user_id: userId,
      version: "v0",
      version_number: 0,
      description: "초기 버전",
      sectionsData: initialData || {},
    });
    
    const result = await dartViewerApi.createVersion(payload);
    
    const initVersion: DBVersionData = {
      v0: {
        createdAt: result.createdAt,
        description: result.description,
        modifiedSections: [],
        section1: result.section1,
        section2: result.section2,
        section3: result.section3,
        section4: result.section4,
        section5: result.section5,
        section6: result.section6,
      }
    }
    return initVersion
  } catch (error) {
    console.error('프로젝트 초기화 오류:', error)
    return {}
  }
}

export async function loadFullProjectState(userId: number): Promise<ProjectState & { sectionsData: Record<string, string> }> {
  try {
    const versionsData = await initializeProject(userId)
    const versionKeys = Object.keys(versionsData)
    
    if (!versionsData || versionKeys.length === 0) {
      throw new Error("프로젝트 초기화 실패")
    }

    let currentVersion = 'v0'
    if (versionKeys.includes('editing')) {
      currentVersion = 'editing'
    } else if (versionKeys.length > 0) {
      const numericVersions = versionKeys.filter(v => v.startsWith('v')).sort((a, b) => parseInt(a.slice(1)) - parseInt(b.slice(1)));
      currentVersion = numericVersions[numericVersions.length - 1];
    }
    const versions: VersionInfo[] = versionKeys.map(version => ({
      version,
      createdAt: versionsData[version].createdAt,
      description: versionsData[version].description || `버전 ${version}`,
      modifiedSections: versionsData[version].modifiedSections || []
    }));
    const editingModifiedSections = versionsData['editing']?.modifiedSections;
    let parseModif: string[] = [];
    if (typeof editingModifiedSections == "string") {
      parseModif = JSON.parse(editingModifiedSections);
    }
    const modifiedSections = new Set(currentVersion === 'editing' ? parseModif || [] : []);
    const versionData = versionsData[currentVersion] || {};
    const sectionsData: Record<string, string> = {};
    Object.keys(versionData).forEach(key => {
      if (key.startsWith("section")) {
        sectionsData[key] = versionData[key as keyof typeof versionData] as string || "";
      }
    });

    return { currentVersion, versions, modifiedSections, sectionsData };
  } catch (error) {
    console.error('loadFullProjectState 오류:', error)
    return {
      currentVersion: 'v0',
      versions: [],
      modifiedSections: new Set(),
      sectionsData: {}
    }
  }
}

export async function createNewVersion(userId: number, description: string | undefined) {
  try {
    const payload = createPayload({
      user_id: userId, 
      description: description || "설명 없음"
    });
    const response = await dartViewerApi.finalizeVersion(payload); 
    
    return { success: true, message: response.message, version: response.new_version };

  } catch (error) {
    console.error('새 버전 생성 오류:', error)
    return { success: false, message: '새 버전 생성 중 오류가 발생했습니다.' }
  }
}

export async function getVersionSections(version: string, userId: number): Promise<Record<string, string>> {
  try {
    const versionsData = await fetchVersionsFromDB(userId)
    
    if (!versionsData[version]) {
      throw new Error(`버전 ${version}을 찾을 수 없습니다.`)
    }
    
    const versionData = versionsData[version]
    
    return {
      'section1': versionData.section1 || '',
      'section2': versionData.section2 || '',
      'section3': versionData.section3 || '',
      'section4': versionData.section4 || '',
      'section5': versionData.section5 || '',
      'section6': versionData.section6 || '',
    }
  } catch (error) {
    console.error('버전 섹션 데이터 가져오기 오류:', error)
    return {}
  }
}


export async function saveDocumentContent(userId: number, sectionKey: string, content: string) {
  try {
    const finalHtml = `<!DOCTYPE html>\n${content}`
    const payload = createPayload({
      user_id: userId, 
      description: "편집중인 버전", 
      sectionsData: { [sectionKey]: finalHtml }
    });

    await dartViewerApi.patchEditingVersion(payload);
    return { success: true, message: "편집 버전이 저장되었습니다.", data: finalHtml}
  } catch (error) {
    console.error('Error saving document content to DB:', error)
    return { success: false, message: 'DB 저장 중 오류가 발생했습니다.' }
  }
}

// 💡 3. token 파라미터 추가
export async function updateDocumentSection(
  userId: number,
  htmlContent: string,
  sectionName: string,
  sectionType: 'section-1' | 'section-2',
  updatedContent: string,
  sectionKey: string,
) {
  try {
    const formattedHtml = await mergeAndFormatSection(htmlContent, sectionType, sectionName, updatedContent);
    if (!formattedHtml) return { success: false, message: "섹션 업데이트 실패: 대상 섹션을 찾을 수 없습니다." };

    const payload = createPayload({
      user_id: userId, 
      description: "편집중인 버전", 
      sectionsData: { [sectionKey]: formattedHtml }
    });

    await dartViewerApi.updateEditingVersion(payload);

    return { success: true, message: "편집 버전이 저장되었습니다.", data: formattedHtml }
  } catch (error) {
    console.error('Error updating document section:', error)
    return { success: false, message: '섹션 업데이트 중 오류가 발생했습니다.' }
  }
}

export async function validateSectionContent(userId: number, sectionId: string, htmlContent: string) {
  try {
    // HTML에서 텍스트만 추출
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const textContent = doc.body?.textContent || doc.documentElement.textContent || '';
    
    // 공백과 줄바꿈 정리
    const cleanedText = textContent.replace(/\s+/g, ' ').trim();
    console.log("cleanedText:", cleanedText)
    
    const payload = {
      indutyName: "소매업",
      section: "핵심투자위험", 
      draft: cleanedText
    };

    const response = await dartViewerApi.validateSection(payload);
    console.log('Validation response:', response)
    
    return { 
      success: true, 
      message: '검증이 완료되었습니다.',
      validationData: response // ValidationResponse 전체 데이터
    };

  } catch (error: any) {
    console.error('섹션 검증 오류:', error)
    return { 
      success: false, 
      message: '검증 중 오류가 발생했습니다.',
      validationData: null
    }
  }
}