// Securities 관련 타입 정의

// DART API 응답 타입
export interface CompanyDataResponse {
  status: string;
  data: {
    companyOverview: {
      corpCode: string;
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
          se?: string;
          amt?: number;
          exstk?: string;
          hdr?: string;
          rlCmp?: string;
          bfslHdstk?: number;
          slstk?: number;
          atslHdstk?: number;
          grtrs?: string;
          exavivr?: string;
          grtcnt?: number;
          expd?: string;
          exprc?: number;
        }>;
      }>;
    };
  };
}

// AI API 요청 타입
export interface AIAnnotationRequest {
  corp_code: string;
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
  S4_NOTE1_1: string;
  S4_NOTE1_2: string;
  S4_NOTE1_3: string;
  S4_NOTE1_4: string;
  S4_NOTE1_5: string;
}

// AI API 응답 타입
export interface EtcMattersResponse {
  statusCode: number;
  message: string;
  data: string;
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
  corp_code: string;
  company_name: string;
  ceo_name: string;
  address: string;
  establishment_date: string;
  company_phone: string;
  company_website: string;

  // 날짜 변수
  S1_1A_1: string,
  S1_1A_2: string,
  S1_1A_3: string
  
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

  // 🆕 S3 섹션 추가 매핑

  // 증권의 종류
  S3_2A_1: string;
  S3_2A_2: string;
  S3_2A_3: string;
  S3_2A_4: string;
  S3_2A_5: string;
  S3_2A_6: string;

  // 인수인정보
  S3_2C_0: string;
  S3_2C_1: string;
  S3_2C_2: string;
  S3_2C_3: string;
  S3_2C_4: string;
  S3_2C_5: string;
  S3_2C_6: string;

  // 일반사항
  S3_2D_1: string;
  S3_2D_2: string;
  S3_2D_3: string;
  S3_2D_4: string;
  S3_2D_5: string;

  // 자금의 사용목적
  S3_2F_DATA: { se: string; amt: string }[];
  S3_2F_1: string;
  S3_2F_2: string;

  // 신주인수권에 관한 사항
  S3_2G_1: string;
  S3_2G_2: string;

  // 매출인에 관한 사항
  S3_2H_DATA: { hdr: string; rlCmp: string; bfslHdstk: string; slstk: string; atslHdstk: string }[];
  S3_2H_1: string;
  S3_2H_2: string;
  S3_2H_3: string;
  S3_2H_4: string;
  S3_2H_5: string;

  // 일반청약자환매청구권
  S3_2I_1: string;
  S3_2I_2: string;
  S3_2I_3: string;
  S3_2I_4: string;
  S3_2I_5: string;
}

export interface BizTemplateData {
    recepNo : string,
    htmlContent: string
}

// 투자위험요소 데이터
export interface RiskData {
  S3_1A_1: string;
  S3_1B_1: string;
  S3_1C_1: string;
}

// 투자위험요소 API 응답 타입 (새로 추가)
export interface RiskApiResponse {
  data: RiskData;
  // 필요하면 다른 프로퍼티들도 추가 가능
  status?: string;
  message?: string;
}

// AI 주석 데이터
export interface AINotesData {
  S4_NOTE1_1: string;
  S4_NOTE1_2: string;
  S4_NOTE1_3: string;
  S4_NOTE1_4: string;
  S4_NOTE1_5: string;
}

// 사업보고서 데이터
export interface BizReportResponse {
  statusCode: number;
  message: string;
  data: {
    recepNo : string,
    htmlContent: string
  };
}

// AI 응답 전 템플릿 데이터 타입 
export type BeforeAITemplateData = BaseTemplateData & RiskData;

// 최종 템플릿 데이터 타입 (기본 데이터 + AI 주석 + 사업보고서)
export type SecuritiesTemplateData = BaseTemplateData & RiskData & AINotesData & BizTemplateData;

// 진행률 콜백 타입
export type ProgressCallback = (step: string, progress: number, details?: string) => void;

// AI 주석 상태 타입
export type AiAnnotationState = 'loading' | 'success' | 'error';

// 최종 서비스 응답 타입
export interface GenerateSecuritiesDataResponse {
  success: boolean;
  data: SecuritiesTemplateData | null;
  aiAnnotationState: AiAnnotationState;
  riskDataState: AiAnnotationState;
  error: string | null;
  duration: number;
}