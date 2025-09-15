export interface VersionInfo {
  version: string;
  createdAt: string;
  description?: string;
  modifiedSections: string[];
}

export interface ProjectState {
  currentVersion: string;
  versions: VersionInfo[];
  modifiedSections: Set<string>;
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

export interface DocumentSection {
  id: string;
  title: string;
  sectionKey: string; // htmlFile → sectionKey로 변경 (DB의 section1, section2 등과 매핑)
  type: 'part' | 'section-1' | 'section-2';
  sectionName?: string;
  children?: DocumentSection[];
}

export interface DocumentContentProps {
  userId: number;
  corpCode: string | null;
  companyName: string | null;
  htmlContent: string;
  sectionId: string;
  sectionName?: string;
  sectionType?: 'part' | 'section-1' | 'section-2';
  onSectionModified?: (sectionId: string, updatedHTML: string) => void;
  modifiedSections?: Set<string>;
  onVersionUpdate?: () => void;
}



export type PayloadOptions = {
  user_id: number;
  corp_code: string;
  company_name?: string;
  version?: string;
  version_number?: number;
  description?: string;
  sectionsData?: Record<string, string>;
  createdAt?: string;
};


export interface VersionSelectorProps {
  currentVersion: string
  versions: VersionInfo[]
  onVersionSelect: (version: string) => void
  disabled?: boolean
}

// 검증 결과 관련 타입 정의
export interface ValidationIssue {
  span: string;
  reason: string;
  rule_id?: string | null;
  evidence: string;
  suggestion: string;
  severity: 'high' | 'medium' | 'low';
}

export interface ValidationQuality {
  context_use: number;
  guideline_adherence: number;
  factuality: number;
  clarity: number;
}

export interface ValidationResponse {
  quality: ValidationQuality;
  decision: 'approve' | 'revise';
  issues: ValidationIssue[];
  notes?: string;
}

export interface HighlightedText {
  text: string;
  issue?: ValidationIssue;
  isHighlighted: boolean;
}


export interface TemplateData {
  corp_code: string;
  company_name: string;
  ceo_name: string;
  address: string;
  establishment_date: string;
  company_phone: string;
  company_website: string;
  S4_11A_1: string;
  S4_11A_2: string;
  S4_11A_3: string;
  S4_11A_4: string;
  S4_11A_5: string;
  S4_11A_6: string;
  S4_11B_1: string;
  S4_11B_2: string;
  S4_11B_3: string;
  S4_11B_4: string;
  S4_11B_5: string;
  S4_11B_6: string;
  S4_11B_7: string;
  S4_11C_1: string;
  S4_11C_2: string;
  S4_11C_3: string;
  S4_11C_4: string;
  S4_11C_5: string;
  S4_NOTE1_1: string;
  S4_NOTE1_2: string;
  S4_NOTE1_3: string;
  S4_NOTE1_4: string;
  S4_NOTE1_5: string;
  htmlContent : string;
}

export type AiAnnotationState = 'loading' | 'success' | 'error';

