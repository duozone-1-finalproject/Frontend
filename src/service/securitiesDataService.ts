import { useState } from 'react';
// services/securitiesDataService.ts
import axios from '../api/axios'; // 기존 axios 설정 사용

// 유틸리티 함수들
const formatNumber = (value: any) => {
  if (!value) return "";
  const num = Number(value);
  if (isNaN(num)) return value;
  return num.toLocaleString("ko-KR");
};

const formatDate = (dateStr: string | null): string => {
  if (!dateStr || dateStr === null) return "-";

  if (dateStr.includes("년")) return dateStr;

  const match = dateStr.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (match) {
    const [, year, month, day] = match;
    return `${year}년 ${parseInt(month, 10)}월 ${parseInt(day, 10)}일`;
  }

  return dateStr;
};

const getDefaultNote = (index: number): string => {
  const defaultNotes: { [key: number]: string } = {
    1: "모집(매출) 예정가액과 관련된 내용은「제1부 모집 또는 매출에 관한 사항」- 「Ⅳ. 인수인의 의견(분석기관의 의견)」의 「4. 공모가격에 대한 의견」부분을 참조하시기 바랍니다.",
    2: "모집(매출)가액, 모집(매출)총액, 인수금액 및 인수대가는 발행회사와 대표주관회사가 협의하여 제시하는 공모희망가액 기준입니다.",
    3: "모집(매출)가액의 확정은 청약일 전에 실시하는 수요예측 결과를 반영하여 대표주관회사와 발행회사가 협의하여 최종 결정할 예정입니다.",
    4: "증권의 발행 및 공시 등에 관한 규정에 따라 정정신고서 상의 공모주식수는 증권신고서의 공모할 주식수의 80% 이상 120% 이하로 변경가능합니다.",
    5: "투자 위험 등 자세한 내용은 투자설명서를 참조하시기 바라며, 투자결정시 신중하게 검토하시기 바랍니다."
  };
  return defaultNotes[index] || "주석 내용을 불러오는 중입니다...";
};

// 템플릿 필러 함수
function fillTemplate(template: string, data: Record<string, any>): string {
  let result = template;
  for (const key in data) {
    const placeholder = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
    const value = data[key] ?? '';
    result = result.replace(placeholder, value);
  }
  return result;
}

// 투자위험요소 문단 분리 함수
function splitTextIntoParagraphs(text: string | null | undefined): string[] {
  // 입력값이 null이거나 undefined, 혹은 빈 문자열이면 빈 배열을 반환합니다.
  if (!text) {
    return [];
  }

  return text
    .split('\n\n') // '\n\n'을 기준으로 문자열을 나눕니다.
    .map(paragraph => paragraph.trim()) // 각 문단의 앞뒤에 있는 불필요한 공백을 제거합니다.
    .filter(paragraph => paragraph.length > 0); // 내용이 없는 빈 문단을 배열에서 제거합니다.
};

// 진행 상황 콜백 타입 정의
type ProgressCallback = (step: string, progress: number, details?: string) => void;

// 메인 데이터 서비스 클래스
export class SecuritiesDataService {

  // 지연 함수 (테스트용)
  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // 1-1. 기본 회사 데이터만 가져오기 (빠른 API)
  static async fetchBasicCompanyData(companyCode: string, onProgress?: ProgressCallback) {
    try {
      onProgress?.("📡 회사 기본 정보 조회 중", 15, "DART API에서 회사 데이터를 가져오는 중...");
      console.log(`📊 [Data Request] 회사 데이터 조회 시작: ${companyCode}`);

      const response = await axios.get(`/api/dart/test/${companyCode}/all-data`);

      if (response.data && response.data.status === "SUCCESS") {
        const apiData = response.data.data;

        onProgress?.("⚙️ 회사 데이터 분석 중", 25, "증권 정보 및 회사 개요 데이터를 구조화하는 중...");

        const mappedData = {
          S1_1A_4: apiData.companyOverview?.corpName,
          S1_1A_5: apiData.companyOverview?.ceoNm,
          S1_1A_6: apiData.companyOverview?.adres,
          S1_1A_7: apiData.companyOverview?.phnNo,
          S1_1A_8: apiData.companyOverview?.hmUrl,
          S1_1A_C: apiData.equitySecurities?.group?.find((g: any) => g.title === "증권의종류")?.list?.[0]?.stksen || "",
          S1_1A_D: formatNumber(apiData.equitySecurities?.group?.find((g: any) => g.title === "증권의종류")?.list?.[0]?.stkcnt),
          S1_1A_E: formatNumber(apiData.equitySecurities?.group?.find((g: any) => g.title === "증권의종류")?.list?.[0]?.slta),
          corp_code: apiData.companyOverview?.corpName,
          company_name: apiData.companyOverview?.corpName,
          ceo_name: apiData.companyOverview?.ceoNm,
          address: apiData.companyOverview?.adres,
          establishment_date: apiData.companyOverview?.estDt,
          company_phone: apiData.companyOverview?.phnNo,
          company_website: apiData.companyOverview?.hmUrl,
          S4_11A_1: apiData.equitySecurities?.group?.find((g: any) => g.title === "증권의종류")?.list?.[0]?.stksen || "",
          S4_11A_2: formatNumber(apiData.equitySecurities?.group?.find((g: any) => g.title === "증권의종류")?.list?.[0]?.stkcnt),
          S4_11A_3: formatNumber(apiData.equitySecurities?.group?.find((g: any) => g.title === "증권의종류")?.list?.[0]?.fv),
          S4_11A_4: formatNumber(apiData.equitySecurities?.group?.find((g: any) => g.title === "증권의종류")?.list?.[0]?.slprc),
          S4_11A_5: formatNumber(apiData.equitySecurities?.group?.find((g: any) => g.title === "증권의종류")?.list?.[0]?.slta),
          S4_11A_6: apiData.equitySecurities?.group?.find((g: any) => g.title === "증권의종류")?.list?.[0]?.slmthn || "",
          S4_11B_1: apiData.equitySecurities?.group?.find((g: any) => g.title === "인수인정보")?.list?.[0]?.actsen || "",
          S4_11B_2: apiData.equitySecurities?.group?.find((g: any) => g.title === "인수인정보")?.list?.[0]?.actnmn || "",
          S4_11B_3: apiData.equitySecurities?.group?.find((g: any) => g.title === "인수인정보")?.list?.[0]?.stksen || "",
          S4_11B_4: formatNumber(apiData.equitySecurities?.group?.find((g: any) => g.title === "인수인정보")?.list?.[0]?.udtcnt),
          S4_11B_5: formatNumber(apiData.equitySecurities?.group?.find((g: any) => g.title === "인수인정보")?.list?.[0]?.udtamt),
          S4_11B_6: formatNumber(apiData.equitySecurities?.group?.find((g: any) => g.title === "인수인정보")?.list?.[0]?.udtprc),
          S4_11B_7: apiData.equitySecurities?.group?.find((g: any) => g.title === "인수인정보")?.list?.[0]?.udtmth || "",
          S4_11C_1: apiData.equitySecurities?.group?.find((g: any) => g.title === "일반사항")?.list?.[0]?.sbd || "",
          S4_11C_2: formatDate(apiData.equitySecurities?.group?.find((g: any) => g.title === "일반사항")?.list?.[0]?.pymd) || "",
          S4_11C_3: formatDate(apiData.equitySecurities?.group?.find((g: any) => g.title === "일반사항")?.list?.[0]?.sband) || "",
          S4_11C_4: formatDate(apiData.equitySecurities?.group?.find((g: any) => g.title === "일반사항")?.list?.[0]?.asand) || "",
          S4_11C_5: formatDate(apiData.equitySecurities?.group?.find((g: any) => g.title === "일반사항")?.list?.[0]?.asstd) || "-",
        };

        console.log("✅ [Data Success] 기본 회사 데이터 매핑 완료:", mappedData);
        return {
          success: true,
          data: mappedData
        };
      } else {
        throw new Error("API 응답 상태가 성공이 아닙니다.");
      }
    } catch (error: any) {
      console.error("❌ [Data Error] 기본 회사 데이터 로딩 실패:", error);
      return {
        success: false,
        error: error.message || "기본 회사 데이터 로드 실패",
        data: null
      };
    }
  }

  // 1-2. 투자위험요소 데이터만 가져오기 (느린 API)
  static async fetchRiskData(companyCode: string, onProgress?: ProgressCallback) {
    try {
      onProgress?.("🔍 투자위험요소 데이터 조회 중", 40, "AI 투자위험요소 정보를 가져오는 중...");
      console.log(`📊 [Risk Request] 회사 투자위험요소 요청 시작: ${companyCode}`);
      
      const responseLisk = await axios.get(`/api/v1/variables/mapping/${companyCode}`);
      
      console.log("🔎 [Risk Response Raw] response_lisk.data:", responseLisk.data);
      
      if (responseLisk.data) {
        const riskData = {
          S3_1A_1: responseLisk.data.data?.S3_1A_1 || "",
          S3_1B_1: responseLisk.data.data?.S3_1B_1 || "",
          S3_1C_1: responseLisk.data.data?.S3_1C_1 || "",
        };

        console.log("✅ [Risk Success] 투자위험요소 데이터 조회 완료:", riskData);
        return {
          success: true,
          data: riskData
        };
      } else {
        throw new Error("투자위험요소 API 응답 오류");
      }
    } catch (error: any) {
      console.error("❌ [Risk Error] 투자위험요소 데이터 로딩 실패:", error);
      return {
        success: false,
        error: error.message || "투자위험요소 데이터 로드 실패",
        data: {
          S3_1A_1: "",
          S3_1B_1: "",
          S3_1C_1: "",
        }
      };
    }
  }

  // 1. 템플릿 데이터 가져오기 (진행 상황 추가) - 레거시 호환용
  static async fetchTemplateData(companyCode: string = '01571107', onProgress?: ProgressCallback) {
    try {
      // 기본 회사 데이터 가져오기
      const basicDataResult = await this.fetchBasicCompanyData(companyCode, onProgress);
      if (!basicDataResult.success) {
        throw new Error(basicDataResult.error);
      }

      // 위험요소 데이터 가져오기
      const riskDataResult = await this.fetchRiskData(companyCode, onProgress);

      // 데이터 통합
      const combinedData = {
        ...basicDataResult.data,
        ...riskDataResult.data
      };

      return {
        success: true,
        data: combinedData
      };
    } catch (error: any) {
      console.error("❌ [Data Error] 템플릿 데이터 로딩 실패:", error);
      return {
        success: false,
        error: error.message || "템플릿 데이터 로드 실패",
        data: null
      };
    }
  }

  // 2. AI 주석 생성 요청 (진행 상황 추가)
  static async requestEquityAnnotations(templateData: Record<string, any>, onProgress?: ProgressCallback) {
    try {
      onProgress?.("🤖 AI 모델 분석 시작", 40, "회사 데이터를 AI에게 전달하는 중...");
      console.log("🤖 [AI Request] 주식 공모 주석 생성 시작");

      const equityRequestData = {
        company_name: templateData.company_name || "",
        ceo_name: templateData.ceo_name || null,
        address: templateData.address || null,
        establishment_date: templateData.establishment_date || null,
        company_phone: templateData.company_phone || null,
        company_website: templateData.company_website || null,
        S4_11A_1: templateData.S4_11A_1 || "",
        S4_11A_2: templateData.S4_11A_2 || "",
        S4_11A_3: templateData.S4_11A_3 || "",
        S4_11A_4: templateData.S4_11A_4 || "",
        S4_11A_5: templateData.S4_11A_5 || "",
        S4_11A_6: templateData.S4_11A_6 || "",
        S4_11B_1: templateData.S4_11B_1 || "",
        S4_11B_2: templateData.S4_11B_2 || "",
        S4_11B_3: templateData.S4_11B_3 || "",
        S4_11B_4: templateData.S4_11B_4 || "",
        S4_11B_5: templateData.S4_11B_5 || "",
        S4_11B_6: templateData.S4_11B_6 || "",
        S4_11B_7: templateData.S4_11B_7 || "",
        S4_11C_1: templateData.S4_11C_1 || "",
        S4_11C_2: templateData.S4_11C_2 || "",
        S4_11C_3: templateData.S4_11C_3 || "",
        S4_11C_4: templateData.S4_11C_4 || "",
        S4_11C_5: templateData.S4_11C_5 || ""
      };

      console.log("🤖 [AI Request] 요청 데이터:", equityRequestData);

      onProgress?.("🤖 AI 주석 생성 중", 50, "AI가 전문적인 주석을 작성하는 중...");

      const response = await axios.post('/api/ai/equity-annotation', equityRequestData, {
        headers: { 'Content-Type': 'application/json' }
      });

      onProgress?.("🤖 AI 검토 단계", 60, "생성된 주석의 품질을 검증하는 중...");

      console.log("🔎 [AI Response Raw] response.data:", response.data);
      console.log("🔎 [AI Response Keys]", Object.keys(response.data || {}));
      if (response.data?.data) {
        console.log("🔎 [AI Response.data Keys]", Object.keys(response.data.data || {}));
      }

      if (response.data && response.status === 200) {
        const aiResponse = response.data.data;

        const generatedNotes = {
          S4_NOTE1_1: aiResponse.S4_NOTE1_1 || getDefaultNote(1),
          S4_NOTE1_2: aiResponse.S4_NOTE1_2 || getDefaultNote(2),
          S4_NOTE1_3: aiResponse.S4_NOTE1_3 || getDefaultNote(3),
          S4_NOTE1_4: aiResponse.S4_NOTE1_4 || getDefaultNote(4),
          S4_NOTE1_5: aiResponse.S4_NOTE1_5 || getDefaultNote(5)
        };

        console.log("✅ [AI Success] 주식 공모 주석 생성 완료:", generatedNotes);

        return {
          success: true,
          data: generatedNotes
        };

      } else {
        throw new Error("AI 주석 생성 응답 오류");
      }
    } catch (error: any) {
      console.error("❌ [AI Error] 주식 공모 주석 생성 실패:", error);

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

// 3. 전체 프로세스 실행 - 병렬 처리로 최적화된 버전
static async generateSecuritiesDataFullyOptimized(
  companyCode: string = '01111111',
  onProgress?: ProgressCallback
) {
  const startTime = Date.now();
  
  try {
    // Step 1: 시작
    onProgress?.("🚀 데이터 수집 준비 중", 0, "회사 정보 조회를 시작합니다");
    await this.delay(200);

    // Step 2: 기본 회사 데이터 가져오기
    const basicDataResult = await this.fetchBasicCompanyData(companyCode, onProgress);
    if (!basicDataResult.success || !basicDataResult.data) {
      throw new Error(basicDataResult.error || "기본 회사 데이터 로드 실패");
    }

    // Step 3: 병렬 처리 시작 안내
    onProgress?.("🚀 AI 분석 및 위험요소 조회 동시 시작", 35, "AI 주석 생성과 투자위험요소 데이터를 병렬로 처리합니다...");
    
    // ✨ 핵심: 병렬 처리 - Promise.all 사용
    const [riskResult, aiResult] = await Promise.all([
      // 투자위험요소 데이터 가져오기
      this.fetchRiskData(companyCode, (step, progress, details) => {
        onProgress?.(`🔍 ${step}`, Math.max(40, progress), details);
      }),
      
      // AI 주석 생성 (기본 회사 데이터 사용)
      this.requestEquityAnnotations(basicDataResult.data, (step, progress, details) => {
        onProgress?.(`🤖 ${step}`, Math.max(50, progress), details);
      })
    ]);

    // Step 4: 병렬 처리 완료
    onProgress?.("🎯 병렬 처리 완료", 75, `AI 주석: ${aiResult.success ? '성공' : '실패'} | 위험요소: ${riskResult.success ? '성공' : '실패'}`);
    await this.delay(200);

    // Step 5: 데이터 통합
    onProgress?.("📋 데이터 통합 및 검증 중", 85, "모든 데이터를 통합하는 중...");
    
    const finalTemplateData = {
      ...basicDataResult.data,  // 기본 회사 데이터
      ...riskResult.data,       // 투자위험요소 데이터
      ...aiResult.data         // AI 생성 주석
    };
    
    await this.delay(200);

    // Step 6: 저장
    onProgress?.("💾 데이터 저장 중", 95, "생성된 데이터를 세션에 저장하는 중...");
    
    sessionStorage.setItem(
      'securitiesTemplateData',
      JSON.stringify(finalTemplateData)
    );
    
    await this.delay(200);

    // Step 7: 완료
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(1);
    
    onProgress?.("✅ 완료", 100, `총 ${duration}초 소요 • AI: ${aiResult.success ? '성공' : '실패'} • 위험요소: ${riskResult.success ? '성공' : '실패'}`);

    console.log("🎉 [Complete] 증권신고서 데이터 생성 완료 (병렬 처리)");

    return {
      success: true,
      data: finalTemplateData,
      aiAnnotationState: aiResult.success ? 'success' : 'error',
      riskDataState: riskResult.success ? 'success' : 'error',
      error: null,
      duration: parseFloat(duration)
    };

  } catch (error: any) {
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(1);
    
    onProgress?.("❌ 오류 발생", 0, `${duration}초 후 오류 발생: ${error.message}`);
    console.error("💥 [Fatal Error] 증권신고서 데이터 생성 실패:", error);

    return {
      success: false,
      data: null,
      aiAnnotationState: 'error',
      riskDataState: 'error', 
      error: error.message || "데이터 생성 실패",
      duration: parseFloat(duration)
    };
  }
}
  // 4. 기존 호환성을 위한 메서드 (기존 사용법 유지)
  static async generateSecuritiesData(
    companyCode: string = '01111111',
    onProgress?: (step: string, progress: number) => void
  ) {
    // 기존 콜백을 새로운 형태로 변환
    const enhancedProgress: ProgressCallback = (step, progress, details) => {
      onProgress?.(step, progress);
    };

    return await this.generateSecuritiesDataFullyOptimized(companyCode, enhancedProgress);
  }

  // 5. 기본 주석 생성 (AI 실패 시 대안)
  static generateDefaultNotes() {
    return {
      S4_NOTE1_1: getDefaultNote(1),
      S4_NOTE1_2: getDefaultNote(2),
      S4_NOTE1_3: getDefaultNote(3),
      S4_NOTE1_4: getDefaultNote(4),
      S4_NOTE1_5: getDefaultNote(5)
    };
  }

  // 6. AI 주석만 재생성 (나중에 변경 버튼용)
  static async regenerateAIAnnotations(templateData: Record<string, any>) {
    console.log("🔄 [Regenerate] AI 주석 재생성 시작");
    return await this.requestEquityAnnotations(templateData);
  }
}

// 유틸리티 함수들 export
export { fillTemplate, formatDate, formatNumber };