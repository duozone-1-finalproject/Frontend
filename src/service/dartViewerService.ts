// Dart Viewer Service - 버전 및 문서 관리 서비스
import { initializeData, createPayload, mergeAndFormatSection, fillTemplate } from "../lib/dartViewerHelpers";
import { DBVersionData, ProjectState, VersionInfo, TemplateData } from "../types/dartViewer";
import { dartViewerApi } from "../api/dartViewerApi";


export async function fetchVersionsFromDB(userId: number, corpCode: string): Promise<DBVersionData> {
  try {
    const payload = {
      user_id: userId,
      corp_code: corpCode
    }
    const response = await dartViewerApi.fetchCompanyVersions(payload);
    // 새로운 응답 구조에서 versions 객체만 반환
    return response.versions || {};
  } catch (error) {
    console.error('DB에서 버전 데이터 가져오기 오류:', error);
    throw error;
  }
}

export async function loadFullProjectState(userId: number, corpCode: string): Promise<ProjectState & { sectionsData: Record<string, string> }> {
  try {
    const versionsData = await fetchVersionsFromDB(userId, corpCode);
    const versionKeys = Object.keys(versionsData);
    
    if (!versionsData || versionKeys.length === 0) {
      throw new Error("프로젝트 초기화 실패 - MainPage에서 먼저 증권신고서를 생성해주세요.");
    }

    let currentVersion = 'v0';
    if (versionKeys.includes('editing')) {
      currentVersion = 'editing';
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

    const result = { currentVersion, versions, modifiedSections, sectionsData };
    return result;
  } catch (error) {
    console.error('❌ [loadFullProjectState] 오류:', error);
    return {
      currentVersion: 'v0',
      versions: [],
      modifiedSections: new Set(),
      sectionsData: {}
    };
  }
}

export async function createNewVersion(userId: number, corpCode: string, description: string | undefined) {
  try {
    const payload = createPayload({
      user_id: userId,
      corp_code: corpCode,
      description: description || "설명 없음"
    });
    const response = await dartViewerApi.finalizeVersion(payload); 
    
    return { success: true, message: response.message, version: response.new_version };

  } catch (error) {
    console.error('새 버전 생성 오류:', error)
    return { success: false, message: '새 버전 생성 중 오류가 발생했습니다.' }
  }
}

export async function getVersionSections(version: string, userId: number, corpCode: string): Promise<Record<string, string>> {
  try {
    const versionsData = await fetchVersionsFromDB(userId, corpCode)
    
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

export async function updateDocumentSection(
  userId: number,
  corpCode: string,
  companyName: string,
  sectionKey: string,
  editedHtml: string,
  options: {
    htmlContent?: string;
    sectionName?: string;
    sectionType?: 'part' | 'section-1' | 'section-2';
  }
) {
  try {
    let finalHtml: string | null = null;

    if (options.sectionType === 'part') {
      // part 전체 저장
      finalHtml = `<!DOCTYPE html>\n${editedHtml}`;
    } else {
      console.log(options.sectionType);
      // 하위 section 병합
      finalHtml = await mergeAndFormatSection(
        options.htmlContent ?? '',
        options.sectionType ?? 'section-2',
        options.sectionName ?? '',
        editedHtml
      );
      if (!finalHtml) {
        return { success: false, message: "섹션 업데이트 실패: 대상 섹션을 찾을 수 없습니다." };
      }
    }

    const payload = createPayload({
      user_id: userId,
      corp_code: corpCode,
      company_name: companyName,
      description: "편집중인 버전",
      sectionsData: { [sectionKey]: finalHtml }
    });

    await dartViewerApi.updateEditingVersion(payload);

    return { success: true, message: "편집 버전이 저장되었습니다.", data: finalHtml };
  } catch (error) {
    console.error("Error saving/updating document content:", error);
    return { success: false, message: "문서 저장/업데이트 중 오류가 발생했습니다." };
  }
}

export async function createV0WithTemplateData(userId: number, templateData: TemplateData) {
  try {
    const versionsData = await fetchVersionsFromDB(userId, templateData.corp_code);

    if (versionsData.v0) {
      return {success: true, message: 'v0 버전이 이미 존재합니다.'};
    }
    // 기본 템플릿 데이터 로드
    const initialSectionsData = await initializeData(companyCode, templateData.htmlContent);
    
    // 각 섹션에 템플릿 데이터 적용
    const filledSectionsData: Record<string, string> = {};
    for (const [sectionKey, template] of Object.entries(initialSectionsData)) {
      filledSectionsData[sectionKey] = fillTemplate(template, templateData);
    }
        
    // v0 버전으로 DB 저장
    const payload = createPayload({
      user_id: userId,
      corp_code: templateData.corp_code,
      company_name: templateData.company_name,
      version: "v0",
      version_number: 0,
      description: `${templateData.company_name} 증권신고서 초기 버전`,
      sectionsData: filledSectionsData,
    });
    
    const result = await dartViewerApi.createVersion(payload);
    
    return {
      success: true,
      message: 'v0 버전이 성공적으로 생성되었습니다.',
      data: result
    };
    
  } catch (error: any) {
    console.error('❌ [Service] v0 버전 생성 실패:', error);
    return {
      success: false,
      message: error.message || 'v0 버전 생성 중 오류가 발생했습니다.',
      data: null
    };
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
      validationData: response.data // ValidationResponse 전체 데이터
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

// AI를 통한 섹션 수정
export async function reviseSectionContent(issue: {
  span: string;
  reason: string;
  rule_id: string;
  evidence: string;
  suggestion: string;
  severity: string;
}) {
  try {
    console.log('AI 수정 요청:', issue);
    
    const response = await dartViewerApi.reviseSection(issue);
    console.log('AI 수정 응답:', response);
    
    return {
      success: true,
      message: 'AI 수정이 완료되었습니다.',
      revisedText: response.data
    };
    
  } catch (error: any) {
    console.error('AI 수정 오류:', error);
    return {
      success: false,
      message: 'AI 수정 중 오류가 발생했습니다: ' + error.message,
      revisedText: null
    };
  }
}