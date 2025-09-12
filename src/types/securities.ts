// Securities 관련 타입 정의

// DART API 응답 타입
export interface CompanyDataResponse {
  status: string;
  data: {
    companyOverview: {
      corpName: string;
      ceoNm: string;
      adres: string;
      phnNo: string;
      hmUrl: string;
      estDt: string;
    };
    equitySecurities: {
      group: Array<{
        title: string;
        list: Array<{
          stksen?: string;
          stkcnt?: number;
          fv?: number;
          slprc?: number;
          slta?: number;
          slmthn?: string;
          actsen?: string;
          actnmn?: string;
          udtcnt?: number;
          udtamt?: number;
          udtprc?: number;
          udtmth?: string;
          sbd?: string;
          pymd?: string;
          sband?: string;
          asand?: string;
          asstd?: string;
        }>;
      }>;
    };
  };
}

// AI API 요청 타입
export interface AIAnnotationRequest {
  company_name: string;
  ceo_name: string | null;
  address: string | null;
  establishment_date: string | null;
  company_phone: string | null;
  company_website: string | null;
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
}

// AI API 응답 타입
export interface AIAnnotationResponse {
  data: {
    S4_NOTE1_1: string;
    S4_NOTE1_2: string;
    S4_NOTE1_3: string;
    S4_NOTE1_4: string;
    S4_NOTE1_5: string;
  };
}

// 서비스 응답 타입
export interface SecuritiesServiceResponse<T> {
  success: boolean;
  data: T | null;
  error?: string;
}

// 기본 템플릿 데이터 (AI 주석 제외)
export interface BaseTemplateData {
  // 기본 회사 정보
  company_name: string;
  ceo_name: string;
  address: string;
  establishment_date: string;
  company_phone: string;
  company_website: string;
  
  // S1 섹션 (기본 정보)
  S1_1A_4: string;
  S1_1A_5: string;
  S1_1A_6: string;
  S1_1A_7: string;
  S1_1A_8: string;
  S1_1A_C: string;
  S1_1A_D: string;
  S1_1A_E: string;
  
  // S4 섹션 (공모 정보)
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
}

// AI 주석 데이터
export interface AINotesData {
  S4_NOTE1_1: string;
  S4_NOTE1_2: string;
  S4_NOTE1_3: string;
  S4_NOTE1_4: string;
  S4_NOTE1_5: string;
}

// 최종 템플릿 데이터 타입 (기본 데이터 + AI 주석)
export type SecuritiesTemplateData = BaseTemplateData & AINotesData;

// 진행률 콜백 타입
export type ProgressCallback = (step: string, progress: number) => void;

// AI 주석 상태 타입
export type AiAnnotationState = 'loading' | 'success' | 'error';

// 최종 서비스 응답 타입
export interface GenerateSecuritiesDataResponse {
  success: boolean;
  data: SecuritiesTemplateData | null;
  aiAnnotationState: AiAnnotationState;
  error: string | null;
}