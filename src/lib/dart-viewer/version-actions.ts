'use server'

import { initializeData } from "../../data/dart-viewer/initializeData"

export interface VersionInfo {
  version: string
  createdAt: string
  description?: string
  modifiedSections: string[]
}

export interface ProjectState {
  currentVersion: string
  versions: VersionInfo[]
  modifiedSections: Set<string>
}

export interface DBVersionData {
  [version: string]: {
    section1: string;
    section2: string;
    section3: string;
    section4: string;
    section5: string;
    section6: string;
    description: string;
    createdAt: string;
    modifiedSections: string[];
  };
}

export async function fetchVersionsFromDB(userId: number, token: string | null): Promise<DBVersionData> {
  try {
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`http://localhost:8080/api/versions?userId=${userId}`, {
      method: 'GET',
      headers: headers,
      cache: 'no-store'
    });
    
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
    }
    
    const data = await response.json()
    return data
  } catch (error) {
    console.error('DB에서 버전 데이터 가져오기 오류:', error)
    throw error
  }
}

export async function initializeProject(userId: number, token: string | null) {
  try {
    const versionsData = await fetchVersionsFromDB(userId, token)

    if (versionsData.v0) {
      return versionsData
    }

    const initialData = await initializeData()

    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch('http://localhost:8080/api/versions', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        user_id: userId,
        version: 'v0',
        version_number: 0,
        description: '초기 버전',
        sectionsData: initialData || {},
        // 💡 'new new Date()' 오타 수정
        createdAt: new Date().toISOString() 
      })
    })

    const result = await response.json()
    
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

export async function loadFullProjectState(userId: number, token: string | null): Promise<ProjectState & { sectionsData: Record<string, string> }> {
  try {
    const versionsData = await initializeProject(userId, token)
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

// 💡 'markSectionAsModified' 함수 추가
export async function markSectionAsModified(sectionId: string) {
  // DB 기반에서는 실제로 저장하지 않고, 클라이언트 상태로만 관리
  // 실제 저장은 createNewVersion에서만 발생
  return { success: true, message: '섹션이 수정됨으로 표시되었습니다.' }
}

export async function createNewVersion(userId: number, description: string | undefined, token: string | null) {
  try {
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch('http://localhost:8080/api/versions/finalize', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        user_id: userId,
        description: description || `설명 없음`,
        createdAt: new Date().toISOString()
      })
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const result = await response.json()
    
    return { 
      success: true, 
      message: result.message,
      version: result.new_version 
    }
  } catch (error) {
    console.error('새 버전 생성 오류:', error)
    return { success: false, message: '새 버전 생성 중 오류가 발생했습니다.' }
  }
}

export async function getVersionSections(version: string, userId: number, token: string | null): Promise<Record<string, string>> {
  try {
    const versionsData = await fetchVersionsFromDB(userId, token)
    
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