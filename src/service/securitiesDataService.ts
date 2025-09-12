// services/securitiesDataService.ts
import { securitiesApi } from '../api/securitiesApi';
import { formatNumber, formatDate, getDefaultNote } from '../lib/securitiesHelpers';
import type { 
  AIAnnotationRequest, 
  SecuritiesServiceResponse,
  BaseTemplateData,
  AINotesData,
  SecuritiesTemplateData,
  GenerateSecuritiesDataResponse,
  ProgressCallback
} from '../types/securities';

// 메인 데이터 서비스 클래스
export class SecuritiesDataService {
  // 1. 템플릿 데이터 가져오기
  static async fetchTemplateData(companyCode: string = '01571107'): Promise<SecuritiesServiceResponse<BaseTemplateData>> {
    try {      
      const response = await securitiesApi.fetchCompanyData(companyCode);
      const apiData = response.data;
        
        const mappedData = {
          S1_1A_4 : apiData.companyOverview?.corpName,
          S1_1A_5: apiData.companyOverview?.ceoNm,
          S1_1A_6: apiData.companyOverview?.adres,
          S1_1A_7: apiData.companyOverview?.phnNo,
          S1_1A_8: apiData.companyOverview?.hmUrl,
          S1_1A_C: apiData.equitySecurities?.group?.find((g:any)=>g.title==="증권의종류")?.list?.[0]?.stksen || "",
          S1_1A_D: formatNumber(apiData.equitySecurities?.group?.find((g:any)=>g.title==="증권의종류")?.list?.[0]?.stkcnt),
          S1_1A_E: formatNumber(apiData.equitySecurities?.group?.find((g:any)=>g.title==="증권의종류")?.list?.[0]?.slta),
          company_name: apiData.companyOverview?.corpName,
          ceo_name: apiData.companyOverview?.ceoNm,
          address: apiData.companyOverview?.adres,
          establishment_date: apiData.companyOverview?.estDt,
          company_phone: apiData.companyOverview?.phnNo,
          company_website: apiData.companyOverview?.hmUrl,
          S4_11A_1: apiData.equitySecurities?.group?.find((g:any)=>g.title==="증권의종류")?.list?.[0]?.stksen || "",
          S4_11A_2: formatNumber(apiData.equitySecurities?.group?.find((g:any)=>g.title==="증권의종류")?.list?.[0]?.stkcnt),
          S4_11A_3: formatNumber(apiData.equitySecurities?.group?.find((g:any)=>g.title==="증권의종류")?.list?.[0]?.fv),
          S4_11A_4: formatNumber(apiData.equitySecurities?.group?.find((g:any)=>g.title==="증권의종류")?.list?.[0]?.slprc),
          S4_11A_5: formatNumber(apiData.equitySecurities?.group?.find((g:any)=>g.title==="증권의종류")?.list?.[0]?.slta),
          S4_11A_6: apiData.equitySecurities?.group?.find((g:any)=>g.title==="증권의종류")?.list?.[0]?.slmthn || "",
          S4_11B_1: apiData.equitySecurities?.group?.find((g:any)=>g.title==="인수인정보")?.list?.[0]?.actsen || "",
          S4_11B_2: apiData.equitySecurities?.group?.find((g:any)=>g.title==="인수인정보")?.list?.[0]?.actnmn || "",
          S4_11B_3: apiData.equitySecurities?.group?.find((g:any)=>g.title==="인수인정보")?.list?.[0]?.stksen || "",
          S4_11B_4: formatNumber(apiData.equitySecurities?.group?.find((g:any)=>g.title==="인수인정보")?.list?.[0]?.udtcnt),
          S4_11B_5: formatNumber(apiData.equitySecurities?.group?.find((g:any)=>g.title==="인수인정보")?.list?.[0]?.udtamt),
          S4_11B_6: formatNumber(apiData.equitySecurities?.group?.find((g:any)=>g.title==="인수인정보")?.list?.[0]?.udtprc),
          S4_11B_7: apiData.equitySecurities?.group?.find((g:any)=>g.title==="인수인정보")?.list?.[0]?.udtmth || "",
          S4_11C_1: apiData.equitySecurities?.group?.find((g:any)=>g.title==="일반사항")?.list?.[0]?.sbd || "",
          S4_11C_2: formatDate(apiData.equitySecurities?.group?.find((g:any)=>g.title==="일반사항")?.list?.[0]?.pymd ?? null) || "",
          S4_11C_3: formatDate(apiData.equitySecurities?.group?.find((g:any)=>g.title==="일반사항")?.list?.[0]?.sband ?? null) || "",
          S4_11C_4: formatDate(apiData.equitySecurities?.group?.find((g:any)=>g.title==="일반사항")?.list?.[0]?.asand ?? null) || "",
          S4_11C_5: formatDate(apiData.equitySecurities?.group?.find((g:any)=>g.title==="일반사항")?.list?.[0]?.asstd ?? null) || "-",
        };

        return {
          success: true,
          data: mappedData
        };
    } catch (error: any) {
      console.error("❌ [Service] 템플릿 데이터 처리 실패:", error);
      return {
        success: false,
        error: error.message || "템플릿 데이터 로드 실패",
        data: null
      };
    }
  }

  // 2. AI 주석 생성 요청
  static async requestEquityAnnotations(templateData: Record<string, any>): Promise<SecuritiesServiceResponse<AINotesData>> {
    try {
      const equityRequestData: AIAnnotationRequest = {
        company_name: templateData.company_name || "",
        ceo_name: templateData.ceo_name ?? null,
        address: templateData.address ?? null,
        establishment_date: templateData.establishment_date ?? null,
        company_phone: templateData.company_phone ?? null,
        company_website: templateData.company_website ?? null,
        S4_11A_1: (templateData.S4_11A_1 as string) || "",
        S4_11A_2: (templateData.S4_11A_2 as string) || "",
        S4_11A_3: (templateData.S4_11A_3 as string) || "",
        S4_11A_4: (templateData.S4_11A_4 as string) || "",
        S4_11A_5: (templateData.S4_11A_5 as string) || "",
        S4_11A_6: (templateData.S4_11A_6 as string) || "",
        S4_11B_1: (templateData.S4_11B_1 as string) || "",
        S4_11B_2: (templateData.S4_11B_2 as string) || "",
        S4_11B_3: (templateData.S4_11B_3 as string) || "",
        S4_11B_4: (templateData.S4_11B_4 as string) || "",
        S4_11B_5: (templateData.S4_11B_5 as string) || "",
        S4_11B_6: (templateData.S4_11B_6 as string) || "",
        S4_11B_7: (templateData.S4_11B_7 as string) || "",
        S4_11C_1: (templateData.S4_11C_1 as string) || "",
        S4_11C_2: (templateData.S4_11C_2 as string) || "",
        S4_11C_3: (templateData.S4_11C_3 as string) || "",
        S4_11C_4: (templateData.S4_11C_4 as string) || "",
        S4_11C_5: (templateData.S4_11C_5 as string) || ""
      };
      
      const response = await securitiesApi.generateEquityAnnotations(equityRequestData);
      const aiResponse = response.data;
        
        
        const generatedNotes = {
          S4_NOTE1_1: aiResponse.S4_NOTE1_1 || getDefaultNote(1),
          S4_NOTE1_2: aiResponse.S4_NOTE1_2 || getDefaultNote(2),
          S4_NOTE1_3: aiResponse.S4_NOTE1_3 || getDefaultNote(3),
          S4_NOTE1_4: aiResponse.S4_NOTE1_4 || getDefaultNote(4),
          S4_NOTE1_5: aiResponse.S4_NOTE1_5 || getDefaultNote(5)
        };
        
        return {
          success: true,
          data: generatedNotes
        };
    } catch (error: any) {
      console.error("❌ [Service] AI 주식 공모 주석 처리 실패:", error);
      
      // 에러 시 기본 주석 반환
      const fallbackNotes = {
        S4_NOTE1_1: `(오류) AI 주석 생성에 실패했습니다: ${error.message}`,
        S4_NOTE1_2: "(오류) AI 주석 생성에 실패했습니다.",
        S4_NOTE1_3: "(오류) AI 주석 생성에 실패했습니다.",
        S4_NOTE1_4: "(오류) AI 주석 생성에 실패했습니다.",
        S4_NOTE1_5: "(오류) AI 주석 생성에 실패했습니다."
      };
      
      return {
        success: false,
        error: error.message || "AI 주석 생성 실패",
        data: fallbackNotes
      };
    }
  }

// 3. 전체 프로세스 실행 (메인페이지에서 호출할 함수)
static async generateSecuritiesData(
    companyCode: string = '01111111',
    onProgress?: ProgressCallback
  ): Promise<GenerateSecuritiesDataResponse> {
    try {
      onProgress?.("회사 정보 조회 중...", 25);
  
      // Step 1: 템플릿 데이터 가져오기
      const templateResult = await this.fetchTemplateData(companyCode);
      if (!templateResult.success || !templateResult.data) {
        throw new Error(templateResult.error || "템플릿 데이터 로드 실패");
      }
  
      onProgress?.("AI 주석 생성 중...", 50);
  
      // Step 2: AI 주석 생성
      const aiResult = await this.requestEquityAnnotations(templateResult.data);
  
      onProgress?.("문서 구성 중...", 75);
  
      // Step 3: 최종 데이터 결합
      const finalTemplateData: SecuritiesTemplateData = {
        ...templateResult.data,
        S4_NOTE1_1: aiResult.data?.S4_NOTE1_1 || getDefaultNote(1),
        S4_NOTE1_2: aiResult.data?.S4_NOTE1_2 || getDefaultNote(2),
        S4_NOTE1_3: aiResult.data?.S4_NOTE1_3 || getDefaultNote(3),
        S4_NOTE1_4: aiResult.data?.S4_NOTE1_4 || getDefaultNote(4),
        S4_NOTE1_5: aiResult.data?.S4_NOTE1_5 || getDefaultNote(5)
      };
  
      // sessionStorage 저장 제거 - DB에 직접 저장됨
      onProgress?.("완료", 100);
    
      return {
        success: true,
        data: finalTemplateData,
        aiAnnotationState: aiResult.success ? 'success' : 'error',
        error: null
      };
  
    } catch (error: any) {
      console.error("💥 [Fatal Error] 증권신고서 데이터 생성 실패:", error);
  
      return {
        success: false,
        data: null,
        aiAnnotationState: 'error',
        error: error.message || "데이터 생성 실패"
      };
    }
  }
  

  // 4. 기본 주석 생성 (AI 실패 시 대안)
  static generateDefaultNotes() {
    return {
      S4_NOTE1_1: getDefaultNote(1),
      S4_NOTE1_2: getDefaultNote(2), 
      S4_NOTE1_3: getDefaultNote(3),
      S4_NOTE1_4: getDefaultNote(4),
      S4_NOTE1_5: getDefaultNote(5)
    };
  }

  // 5. AI 주석만 재생성 (나중에 변경 버튼용)
  static async regenerateAIAnnotations(templateData: Record<string, any>) {
    console.log("🔄 [Regenerate] AI 주석 재생성 시작");
    return await this.requestEquityAnnotations(templateData);
  }
}

