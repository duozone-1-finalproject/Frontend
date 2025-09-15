import axios from '../api/axios';
import { DocumentSection } from "../types/dartViewer";
import prettier from "prettier/standalone";
import parserHtml from "prettier/plugins/html";
import { PayloadOptions } from "../types/dartViewer";
import { TemplateData } from "../types/dartViewer";
import { securitiesApi } from "../api/securitiesApi";

export const mockDocumentData: DocumentSection[] = [
  {
    id: '1',
    title: '증권신고서',
    sectionKey: 'section1',
    type: 'part'
  },
  {
    id: '2',
    title: '【 대표이사 등의 확인 】',
    sectionKey: 'section2',
    type: 'part'
  },
  {
    id: '3',
    title: '요약정보',
    sectionKey: 'section3',
    type: 'part',
    children: [
      {
        id: '4',
        title: '1. 핵심투자위험',
        sectionKey: 'section3',
        type: 'section-2',
        sectionName: '핵심투자위험'
      },
      {
        id: '5',
        title: '2. 모집 또는 매출에 관한 일반사항',
        sectionKey: 'section3',
        type: 'section-2',
        sectionName: '모집 또는 매출에 관한 일반사항'
      }
    ]
  },
  {
    id: '6',
    title: '제1부 모집 또는 매출에 관한 사항',
    sectionKey: 'section4',
    type: 'part',
    children: [
      {
        id: '7',
        title: 'I. 모집 또는 매출에 관한 일반사항',
        sectionKey: 'section4',
        type: 'section-1',
        sectionName: '모집 또는 매출에 관한 일반사항',
        children: [
          {
            id: '8',
            title: '1. 공모개요',
            sectionKey: 'section4',
            type: 'section-2',
            sectionName: '공모개요'
          },
          {
            id: '9',
            title: '2. 공모방법',
            sectionKey: 'section4',
            type: 'section-2',
            sectionName: '공모방법'
          },
          {
            id: '10',
            title: '3. 공모가격 결정방법',
            sectionKey: 'section4',
            type: 'section-2',
            sectionName: '공모가격 결정방법'
          },
          {
            id: '11',
            title: '4. 모집 또는 매출절차 등에 관한 사항',
            sectionKey: 'section4',
            type: 'section-2',
            sectionName: '모집 또는 매출절차 등에 관한 사항'
          },
          {
            id: '12',
            title: '5. 인수 등에 관한 사항',
            sectionKey: 'section4',
            type: 'section-2',
            sectionName: '인수 등에 관한 사항'
          }
        ]
      },
      {
        id: '13',
        title: 'II. 증권의 주요 권리내용',
        sectionKey: 'section4',
        type: 'section-1',
        sectionName: '증권의 주요 권리내용'
      },
      {
        id: '14',
        title: 'III. 투자위험요소',
        sectionKey: 'section4',
        type: 'section-1',
        sectionName: '투자위험요소',
        children: [
          {
            id: '15',
            title: '1. 사업위험',
            sectionKey: 'section4',
            type: 'section-2',
            sectionName: '사업위험'
          },
          {
            id: '16',
            title: '2. 회사위험',
            sectionKey: 'section4',
            type: 'section-2',
            sectionName: '회사위험'
          },
          {
            id: '17',
            title: '3. 기타위험',
            sectionKey: 'section4',
            type: 'section-2',
            sectionName: '기타위험'
          }
        ]
      },
      {
        id: '18',
        title: 'IV. 인수인의 의견(분석기관의 평가의견)',
        sectionKey: 'section4',
        type: 'section-1',
        sectionName: '인수인의 의견(분석기관의 평가의견)'
      },
      {
        id: '19',
        title: 'V. 자금의 사용목적',
        sectionKey: 'section4',
        type: 'section-1',
        sectionName: '자금의 사용목적'
      },
      {
        id: '20',
        title: 'VI. 그 밖에 투자자보호를 위해 필요한 사항',
        sectionKey: 'section4',
        type: 'section-1',
        sectionName: '그 밖에 투자자보호를 위해 필요한 사항'
      }
    ]
  },
  {
    id: '21',
    title: '제2부 발행인에 관한 사항',
    sectionKey: 'section5',
    type: 'part',
    children: [
      {
        id: '22',
        title: 'I. 회사의 개요',
        sectionKey: 'section5',
        type: 'section-1',
        sectionName: '회사의 개요',
        children: [
          {
            id: '23',
            title: '1. 회사의 개요',
            sectionKey: 'section5',
            type: 'section-2',
            sectionName: '회사의 개요',
          },
          {
            id: '24',
            title: '2. 회사의 연혁',
            sectionKey: 'section5',
            type: 'section-2',
            sectionName: '회사의 연혁',
          },
          {
            id: '25',
            title: '3. 자본금 변동사항',
            sectionKey: 'section5',
            type: 'section-2',
            sectionName: '자본금 변동사항',
          },
          {
            id: '26',
            title: '4. 주식의 총수 등',
            sectionKey: 'section5',
            type: 'section-2',
            sectionName: '주식의 총수 등',
          },
          {
            id: '27',
            title: '5. 정관에 관한 사항',
            sectionKey: 'section5',
            type: 'section-2',
            sectionName: '정관에 관한 사항',
          }
        ]
      },
      {
        id: '28',
        title: 'II. 사업의 내용',
        sectionKey: 'section5',
        type: 'section-1',
        sectionName: '사업의 내용',
        children: [
          {
            id: '29',
            title: '1. 사업의 개요',
            sectionKey: 'section5',
            type: 'section-2',
            sectionName: '사업의 개요',
          },
          {
            id: '30',
            title: '2. 주요 제품 및 서비스',
            sectionKey: 'section5',
            type: 'section-2',
            sectionName: '주요 제품 및 서비스',
          },
          {
            id: '31',
            title: '3. 원재료 및 생산설비',
            sectionKey: 'section5',
            type: 'section-2',
            sectionName: '원재료 및 생산설비',
          },
          {
            id: '32',
            title: '4. 매출 및 수주상황',
            sectionKey: 'section5',
            type: 'section-2',
            sectionName: '매출 및 수주상황',
          },
          {
            id: '33',
            title: '5. 위험관리 및 파생거래',
            sectionKey: 'section5',
            type: 'section-2',
            sectionName: '위험관리 및 파생거래',
          },
          {
            id: '34',
            title: '6. 주요계약 및 연구개발활동',
            sectionKey: 'section5',
            type: 'section-2',
            sectionName: '주요계약 및 연구개발활동',
          },
          {
            id: '35',
            title: '7. 기타 참고사항',
            sectionKey: 'section5',
            type: 'section-2',
            sectionName: '기타 참고사항',
          }
        ]
      },
      {
        id: '36',
        title: 'III. 재무에 관한 사항',
        sectionKey: 'section5',
        type: 'section-1',
        sectionName: '재무에 관한 사항',
        children: [
          {
            id: '37',
            title: '1. 요약재무정보',
            sectionKey: 'section5',
            type: 'section-2',
            sectionName: '요약재무정보',
          },
          {
            id: '38',
            title: '2. 연결재무제표',
            sectionKey: 'section5',
            type: 'section-2',
            sectionName: '연결재무제표',
          },
          {
            id: '39',
            title: '3. 연결재무제표 주석',
            sectionKey: 'section5',
            type: 'section-2',
            sectionName: '연결재무제표 주석',
          },
          {
            id: '40',
            title: '4. 재무제표',
            sectionKey: 'section5',
            type: 'section-2',
            sectionName: '재무제표',
          },
          {
            id: '41',
            title: '5. 재무제표 주석',
            sectionKey: 'section5',
            type: 'section-2',
            sectionName: '재무제표 주석',
          },
          {
            id: '42',
            title: '6. 배당에 관한 사항',
            sectionKey: 'section5',
            type: 'section-2',
            sectionName: '배당에 관한 사항',
          },
          {
            id: '43',
            title: '7. 증권의 발행을 통한 자금조달에 관한 사항',
            sectionKey: 'section5',
            type: 'section-2',
            sectionName: '증권의 발행을 통한 자금조달에 관한 사항',
          },
          {
            id: '46',
            title: '8. 기타 재무에 관한 사항',
            sectionKey: 'section5',
            type: 'section-2',
            sectionName: '기타 재무에 관한 사항',
          }
        ]
      },
      {
        id: '47',
        title: 'IV. 회계감사인의 감사의견 등',
        sectionKey: 'section5',
        type: 'section-1',
        sectionName: '회계감사인의 감사의견 등',
        children: [
          {
            id: '48',
            title: '1. 외부감사에 관한 사항',
            sectionKey: 'section5',
            type: 'section-2',
            sectionName: '외부감사에 관한 사항',
          },
          {
            id: '49',
            title: '2. 내부통제에 관한 사항',
            sectionKey: 'section5',
            type: 'section-2',
            sectionName: '내부통제에 관한 사항',
          }
        ]
      },
      {
        id: '50',
        title: 'V. 이사회 등 회사의 기관에 관한 사항',
        sectionKey: 'section5',
        type: 'section-1',
        sectionName: '이사회 등 회사의 기관에 관한 사항',
        children: [
          {
            id: '51',
            title: '1. 이사회에 관한 사항',
            sectionKey: 'section5',
            type: 'section-2',
            sectionName: '이사회에 관한 사항',
          },
          {
            id: '52',
            title: '2. 감사제도에 관한 사항',
            sectionKey: 'section5',
            type: 'section-2',
            sectionName: '감사제도에 관한 사항',
          },
          {
            id: '53',
            title: '3. 주주총회 등에 관한 사항',
            sectionKey: 'section5',
            type: 'section-2',
            sectionName: '주주총회 등에 관한 사항',
          }
        ]
      },
      {
        id: '54',
        title: 'VI. 주주에 관한 사항',
        sectionKey: 'section5',
        type: 'section-1',
        sectionName: '주주에 관한 사항',
      },
      {
        id: '55',
        title: 'VII. 임원 및 직원 등에 관한 사항',
        sectionKey: 'section5',
        type: 'section-1',
        sectionName: '임원 및 직원 등에 관한 사항',
        children: [
          {
            id: '56',
            title: '1. 임원 및 직원 등의 현황',
            sectionKey: 'section5',
            type: 'section-2',
            sectionName: '임원 및 직원 등의 현황',
          },
          {
            id: '57',
            title: '2. 임원의 보수 등',
            sectionKey: 'section5',
            type: 'section-2',
            sectionName: '임원의 보수 등',
          }
        ]
      },
      {
        id: '58',
        title: 'VIII. 계열회사 등에 관한 사항',
        sectionKey: 'section5',
        type: 'section-1',
        sectionName: '계열회사 등에 관한 사항',
      },
      {
        id: '59',
        title: 'IX. 대주주 등과의 거래내용',
        sectionKey: 'section5',
        type: 'section-1',
        sectionName: '대주주 등과의 거래내용',
      },
      {
        id: '60',
        title: 'X. 그 밖에 투자자 보호를 위하여 필요한 사항',
        sectionKey: 'section5',
        type: 'section-1',
        sectionName: '그 밖에 투자자 보호를 위하여 필요한 사항',
        children: [
          {
            id: '61',
            title: '1. 공시내용 진행 및 변경사항',
            sectionKey: 'section5',
            type: 'section-2',
            sectionName: '공시내용 진행 및 변경사항',
          },
          {
            id: '62',
            title: '2. 우발부채 등에 관한 사항',
            sectionKey: 'section5',
            type: 'section-2',
            sectionName: '우발부채 등에 관한 사항',
          },
          {
            id: '63',
            title: '3. 제재 등과 관련된 사항',
            sectionKey: 'section5',
            type: 'section-2',
            sectionName: '제재 등과 관련된 사항',
          },
          {
            id: '64',
            title: '4. 작성기준일 이후 발생한 주요사항 등 기타사항',
            sectionKey: 'section5',
            type: 'section-2',
            sectionName: '작성기준일 이후 발생한 주요사항 등 기타사항',
          }
        ]
      },
      {
        id: '65',
        title: 'XI. 상세표',
        sectionKey: 'section5',
        type: 'section-1',
        sectionName: '상세표',
      }
    ]
  },
  {
    id: '66',
    title: '【 전문가의 확인 】',
    sectionKey: 'section6',
    type: 'part',
    sectionName: '재무에 관한 사항',
    children: [
      {
        id: '67',
        title: '1. 전문가의 확인',
        sectionKey: 'section6',
        type: 'section-2',
        sectionName: '전문가의 확인',
      },
      {
        id: '68',
        title: '2. 전문가와의 이해관계',
        sectionKey: 'section6',
        type: 'section-2',
        sectionName: '전문가와의 이해관계',
      }
    ]
  }
]


const SECTION_FILES = [
  "section-1.html",
  "section-2.html",
  "section-3.html",
  "section-4.html",
  "section-5.html",
  "section-6.html",
] as const;

export async function initializeData(): Promise<Record<string, string>> {
  const sectionsData: Record<string, string> = {};

  for (let i = 0; i < SECTION_FILES.length; i++) {
    const res = await fetch(`/initialTemplate/${SECTION_FILES[i]}`);
    sectionsData[`section${i + 1}`] = await res.text();
  }

  return sectionsData;
}


/**
 * DB 섹션 키를 섹션 ID로 변환하는 헬퍼 함수
 */
export function getSectionKeyFromId(id: string): string {
  const section = findSectionById(mockDocumentData, id);
  return section?.sectionKey || 'section1';
}

/**
 * 섹션 ID로 섹션 찾기 (재귀)
 */
export function findSectionById(sections: DocumentSection[], id: string): DocumentSection | null {
  for (const section of sections) {
    if (section.id === id) return section;
    if (section.children) {
      const found = findSectionById(section.children, id);
      if (found) return found;
    }
  }
  return null;
}

/**
 * 섹션이 최하위 섹션(children이 없는 섹션)인지 확인
 */
export function isLeafSection(section: DocumentSection | null): boolean {
  return section ? !section.children || section.children.length === 0 : false;
}


/**
 * API 요청용 페이로드 생성 함수
 */
export function createPayload(options: PayloadOptions): Record<string, unknown> {
  const {
    user_id,
    corp_code,
    company_name,
    version,
    version_number,
    description = "편집중인 버전",
    sectionsData,
    createdAt = new Date().toISOString(),
  } = options;

  const payload: Record<string, unknown> = {
    user_id,
    corp_code,
    description,
    createdAt,
  };

  if (company_name !== undefined) payload.company_name = company_name;
  if (version !== undefined) payload.version = version;
  if (version_number !== undefined) payload.version_number = version_number;
  if (sectionsData !== undefined) payload.sectionsData = sectionsData;

  return payload;
}


/**
 * 템플릿에 데이터를 채우는 헬퍼 함수
 */
export const fillTemplate = (template: string, data: TemplateData): string => {
  let result = template;
  for (const [key, value] of Object.entries(data)) {
    const placeholder = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
    const fillValue = value ?? '';
    result = result.replace(placeholder, fillValue);
  }
  return result;
};

/**
 * iframe을 읽기 전용 모드로 설정하는 헬퍼 함수
 */
export const ensureReadOnlyMode = (iframeDoc: Document) => {
  const body = iframeDoc.body;
  if (!body) return;
  
  body.contentEditable = 'false';
  body.style.outline = 'none';
  body.style.outlineOffset = '0';
  
  const existingStyles = iframeDoc.querySelectorAll('style');
  existingStyles.forEach(style => {
    if (style.textContent?.includes('contenteditable')) {
      style.remove();
    }
  });
};

/**
 * HTML 병합 및 포맷팅 함수
 */
export async function mergeAndFormatSection(
  originalHtml: string, 
  sectionType: string, 
  sectionName: string, 
  updatedHtml: string
): Promise<string | null> {
  try {
    const updatedDoc = new DOMParser().parseFromString(updatedHtml, "text/html");
    const updatedSection = updatedDoc.querySelector(`.${sectionType}[data-section="${sectionName}"]`);
    if (!updatedSection) return null;

    const originalDoc = new DOMParser().parseFromString(originalHtml, "text/html");
    const originalSection = originalDoc.querySelector(`.${sectionType}[data-section="${sectionName}"]`);
    if (!originalSection) return null;

    originalSection.outerHTML = updatedSection.outerHTML;
    const finalHtml = `<!DOCTYPE html>\n${originalDoc.documentElement.outerHTML}`;
    
    return await prettier.format(finalHtml, { 
      parser: "html", 
      plugins: [parserHtml] 
    });
  } catch (error) {
    console.error('HTML 병합 및 포맷팅 오류:', error);
    return null;
  }
}