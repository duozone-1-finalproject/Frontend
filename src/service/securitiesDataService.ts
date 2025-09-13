// services/securitiesDataService.ts
import { formatNumber, formatDate, getDefaultNote, splitTextIntoParagraphs, getCurrentDateVariables } from '../lib/securitiesHelpers';
import type { 
  AIAnnotationRequest, 
  SecuritiesServiceResponse,
  BaseTemplateData,
  RiskData,
  AINotesData,
  SecuritiesTemplateData,
  GenerateSecuritiesDataResponse,
  ProgressCallback,
  BeforeAITemplateData,
  RiskApiResponse
} from '../types/securities';

// 메인 데이터 서비스 클래스 - 완전 더미 모드
export class SecuritiesDataService {

  // 지연 함수 (실제 API 호출하는 것처럼 보이게)
  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // 1-1. 더미 회사 데이터 생성
  static async fetchBasicCompanyData(companyCode: string, onProgress?: ProgressCallback): Promise<SecuritiesServiceResponse<BaseTemplateData>> {
    try {      
      onProgress?.("📡 회사 기본 정보 조회 중", 15, "더미 회사 데이터를 생성하는 중...");
      await this.delay(500);

      onProgress?.("⚙️ 회사 데이터 분석 중", 25, "더미 증권 정보 및 회사 개요 데이터를 구조화하는 중...");
      await this.delay(300);

      // 🆕 현재 날짜 변수 추가
      const currentDateVars = getCurrentDateVariables();
        
      // 🆕 완전 더미 데이터 생성
      const dummyMappedData: BaseTemplateData = {
        // 현재 날짜 변수
        ...currentDateVars,

        // 기본 회사 정보 (더미)
        S1_1A_4: `더미코퍼레이션(${companyCode})`,
        S1_1A_5: "김더미",
        S1_1A_6: "서울특별시 강남구 테헤란로 123",
        S1_1A_7: "02-1234-5678",
        S1_1A_8: "https://www.dummy-corp.com",
        S1_1A_C: "보통주",
        S1_1A_D: "1,000,000",
        S1_1A_E: "50,000,000,000",

        corp_code: companyCode,
        company_name: `더미코퍼레이션(${companyCode})`,
        ceo_name: "김더미",
        address: "서울특별시 강남구 테헤란로 123",
        establishment_date: "2020-03-15",
        company_phone: "02-1234-5678",
        company_website: "https://www.dummy-corp.com",

        // 증권의 종류 (더미)
        S4_11A_1: "보통주",
        S4_11A_2: "1,000,000",
        S4_11A_3: "5,000",
        S4_11A_4: "50,000",
        S4_11A_5: "50,000,000,000",
        S4_11A_6: "일반공모",

        // 인수인정보 (더미)
        S4_11B_1: "주관회사",
        S4_11B_2: "더미증권주식회사",
        S4_11B_3: "보통주",
        S4_11B_4: "800,000",
        S4_11B_5: "40,000,000,000",
        S4_11B_6: "50,000",
        S4_11B_7: "총액인수",

        // 일반사항 (더미)
        S4_11C_1: "2025.09.20 ~ 2025.09.21",
        S4_11C_2: "2025.09.25",
        S4_11C_3: "2025.09.18",
        S4_11C_4: "2025.09.24",
        S4_11C_5: "2025.09.23",

        // 새로운 매핑 - 증권의 종류
        S3_2A_1: "보통주",
        S3_2A_2: "1,000,000",
        S3_2A_3: "5,000",
        S3_2A_4: "50,000",
        S3_2A_5: "50,000,000,000",
        S3_2A_6: "일반공모",

        // 새로운 매핑 - 인수인정보
        S3_2C_0: "주관회사",
        S3_2C_1: "더미증권주식회사",
        S3_2C_2: "보통주",
        S3_2C_3: "800,000",
        S3_2C_4: "40,000,000,000",
        S3_2C_5: "50,000",
        S3_2C_6: "총액인수",

        // 새로운 매핑 - 일반사항
        S3_2D_1: "2025.09.20 ~ 2025.09.21",
        S3_2D_2: "2025.09.25",
        S3_2D_3: "2025.09.18",
        S3_2D_4: "2025.09.24",
        S3_2D_5: "2025.09.23",

        // 자금의 사용목적 (더미)
        S3_2F_DATA: [
          { se: "시설투자", amt: "30,000,000,000" },
          { se: "운영자금", amt: "15,000,000,000" },
          { se: "기타", amt: "5,000,000,000" }
        ],
        S3_2F_1: "시설투자",
        S3_2F_2: "30,000,000,000",

        // 신주인수권에 관한 사항 (더미)
        S3_2G_1: "보통주",
        S3_2G_2: "45,000",

        // 매출인에 관한 사항 (더미)
        S3_2H_DATA: [
          {
            hdr: "김대주주",
            rlCmp: "대표이사",
            bfslHdstk: "5,000,000",
            slstk: "200,000",
            atslHdstk: "4,800,000"
          }
        ],
        S3_2H_1: "김대주주",
        S3_2H_2: "대표이사",
        S3_2H_3: "5,000,000",
        S3_2H_4: "200,000",
        S3_2H_5: "4,800,000",

        // 일반청약자환매청구권 (더미)
        S3_2I_1: "공모가 대비 하락",
        S3_2I_2: "일반청약자",
        S3_2I_3: "전체",
        S3_2I_4: "상장일로부터 6개월",
        S3_2I_5: "공모가의 90%"
      };

      onProgress?.("✅ 더미 회사 데이터 생성 완료", 30, "모든 더미 데이터가 성공적으로 매핑되었습니다.");

      return {
        success: true,
        data: dummyMappedData
      };
    } catch (error: any) {
      console.error("❌ [Service] 더미 템플릿 데이터 처리 실패:", error);
      return {
        success: false,
        error: error.message || "더미 템플릿 데이터 로드 실패",
        data: null
      };
    }
  }

  // 1-2. 더미 투자위험요소 데이터 생성
  static async fetchRiskData(companyCode: string, onProgress?: ProgressCallback): Promise<SecuritiesServiceResponse<RiskData>> {
    try {
      onProgress?.("🔍 투자위험요소 데이터 조회 중", 40, "더미 투자위험요소 정보를 생성하는 중...");
      console.log(`📊 [Risk Request - DUMMY MODE] 회사 투자위험요소 더미 데이터 생성: ${companyCode}`);
      
      await this.delay(800);
      
      // 더미 데이터 생성
      const dummyRiskData: RiskData = {
        S3_1A_1: `[더미 데이터] ${companyCode} 회사의 시장 위험 요소입니다. 시장 변동성, 경쟁사 동향, 규제 변화 등이 주요 위험 요인으로 작용할 수 있습니다. 투자자는 이러한 위험 요소를 충분히 검토한 후 투자 결정을 내리시기 바랍니다.`,
        S3_1B_1: `[더미 데이터] 운영 관련 위험으로는 핵심 인력 이탈, 기술 변화에 대한 적응 지연, 공급망 중단 등이 있습니다. 특히 디지털 전환 시대에 기술 혁신에 대한 지속적인 투자가 필요하며, 이에 따른 비용 증가가 수익성에 영향을 미칠 수 있습니다.`,
        S3_1C_1: `[더미 데이터] 재무적 위험으로는 유동성 부족, 부채비율 증가, 환율 변동 등이 주요 고려사항입니다. 현금흐름 관리와 적정 부채비율 유지가 중요하며, 외화 거래가 있는 경우 환헤지 전략이 필요합니다.`
      };
      
      console.log("✅ [Risk Success - DUMMY] 투자위험요소 더미 데이터 생성 완료:", dummyRiskData);
      return {
        success: true,
        data: dummyRiskData
      };
      
    } catch (error: any) {
      console.error("❌ [Risk Error - DUMMY] 투자위험요소 더미 데이터 생성 실패:", error);
      return {
        success: false,
        error: error.message || "투자위험요소 더미 데이터 생성 실패",
        data: {
          S3_1A_1: "[오류] 더미 데이터 생성 실패",
          S3_1B_1: "[오류] 더미 데이터 생성 실패",
          S3_1C_1: "[오류] 더미 데이터 생성 실패",
        }
      };
    }
  }

  // 1. 템플릿 데이터 가져오기 - 레거시 호환용
  static async fetchTemplateData(companyCode: string = '01571107', onProgress?: ProgressCallback): Promise<SecuritiesServiceResponse<BeforeAITemplateData>> {
    try {
      // 기본 회사 더미 데이터 가져오기
      const basicDataResult = await this.fetchBasicCompanyData(companyCode, onProgress);
      if (!basicDataResult.success) {
        throw new Error(basicDataResult.error);
      }

      // 위험요소 더미 데이터 가져오기
      const riskDataResult = await this.fetchRiskData(companyCode, onProgress);

      // 데이터 통합
      const combinedData: BeforeAITemplateData = {
        ...basicDataResult.data!,
        ...riskDataResult.data!
      };

      return {
        success: true,
        data: combinedData,
      };
    } catch (error: any) {
      console.error("❌ [Data Error] 더미 템플릿 데이터 로딩 실패:", error);
      return {
        success: false,
        error: error.message || "더미 템플릿 데이터 로드 실패",
        data: null
      };
    }
  }

  // 2. 더미 AI 주석 생성
  static async requestEquityAnnotations(templateData: Record<string, any>, onProgress?: ProgressCallback): Promise<SecuritiesServiceResponse<AINotesData>> {
    try {
      onProgress?.("🤖 AI 모델 분석 시작", 40, "더미 AI 주석을 생성하는 중...");
      console.log("🤖 [AI Request - DUMMY MODE] 주식 공모 더미 주석 생성 시작");

      await this.delay(1200);
      
      onProgress?.("🤖 AI 검토 단계", 60, "더미 주석의 품질을 검증하는 중...");
      await this.delay(400);

      // 더미 AI 응답 생성
      const companyName = templateData.company_name || '더미회사';
      const dummyAIResponse = {
        S4_NOTE1_1: `[더미 AI 주석] ${companyName}의 증권 발행에 대한 주요 특징과 투자 포인트를 분석한 전문적인 해설입니다. 이 회사는 안정적인 사업 기반을 바탕으로 성장 가능성이 높은 기업으로 평가됩니다.`,
        S4_NOTE1_2: `[더미 AI 주석] 발행 조건 및 시장 환경을 고려할 때, 본 증권은 투자자에게 적절한 리스크-리턴 구조를 제공할 것으로 예상됩니다. 특히 현재 시장 상황에서의 투자 메리트가 돋보입니다.`,
        S4_NOTE1_3: `[더미 AI 주석] 인수 구조와 배정 방식이 투자자 친화적으로 설계되어 있어 일반 투자자들의 참여 기회가 충분히 보장될 것으로 보입니다.`,
        S4_NOTE1_4: `[더미 AI 주석] 자금 조달 목적이 명확하고 구체적이어서 조달된 자금이 회사 성장에 직접적으로 기여할 것으로 기대됩니다.`,
        S4_NOTE1_5: `[더미 AI 주석] 전반적으로 투자 조건과 회사 펀더멘털을 종합적으로 고려할 때, 중장기적 관점에서 투자 매력도가 높다고 평가할 수 있습니다.`
      };

      const generatedNotes: AINotesData = {
        S4_NOTE1_1: dummyAIResponse.S4_NOTE1_1 || getDefaultNote(1),
        S4_NOTE1_2: dummyAIResponse.S4_NOTE1_2 || getDefaultNote(2),
        S4_NOTE1_3: dummyAIResponse.S4_NOTE1_3 || getDefaultNote(3),
        S4_NOTE1_4: dummyAIResponse.S4_NOTE1_4 || getDefaultNote(4),
        S4_NOTE1_5: dummyAIResponse.S4_NOTE1_5 || getDefaultNote(5)
      };

      console.log("✅ [AI Success - DUMMY] 주식 공모 더미 주석 생성 완료:", generatedNotes);

      return {
        success: true,
        data: generatedNotes
      };
    } catch (error: any) {
      console.error("❌ [AI Error - DUMMY] 주식 공모 더미 주석 생성 실패:", error);

      // 에러 시 기본 주석 반환
      const fallbackNotes: AINotesData = {
        S4_NOTE1_1: `(오류) 더미 AI 주석 생성에 실패했습니다: ${error.message}`,
        S4_NOTE1_2: "(오류) 더미 AI 주석 생성에 실패했습니다.",
        S4_NOTE1_3: "(오류) 더미 AI 주석 생성에 실패했습니다.",
        S4_NOTE1_4: "(오류) 더미 AI 주석 생성에 실패했습니다.",
        S4_NOTE1_5: "(오류) 더미 AI 주석 생성에 실패했습니다."
      };

      return {
        success: false,
        error: error.message || "더미 AI 주석 생성 실패",
        data: fallbackNotes
      };
    }
  }

  // 3. 전체 프로세스 실행 - 완전 더미 처리 병렬 버전
  static async generateSecuritiesDataFullyOptimized(
    companyCode: string = '01111111',
    onProgress?: ProgressCallback
  ): Promise<GenerateSecuritiesDataResponse> {
    const startTime = Date.now();

    try {
      // Step 1: 시작
      onProgress?.("🚀 더미 데이터 수집 준비 중", 0, "더미 회사 정보 조회를 시작합니다");
      await this.delay(200);
  
      // Step 2: 기본 회사 더미 데이터 가져오기
      const basicDataResult = await this.fetchBasicCompanyData(companyCode, onProgress);
      if (!basicDataResult.success || !basicDataResult.data) {
        throw new Error(basicDataResult.error || "더미 기본 회사 데이터 로드 실패");
      }
  
      // Step 3: 병렬 처리 시작 안내
      onProgress?.("🚀 더미 AI 분석 및 위험요소 조회 동시 시작", 35, "더미 AI 주석 생성과 더미 투자위험요소 데이터를 병렬로 처리합니다...");

      // 핵심: 병렬 처리 - 모든 것이 더미
      const [riskResult, aiResult] = await Promise.all([
        // 투자위험요소 더미 데이터
        this.fetchRiskData(companyCode, (step: string, progress: number, details?: string) => {
          onProgress?.(`🔍 ${step}`, Math.max(40, progress), details);
        }),
        
        // AI 더미 주석 생성
        this.requestEquityAnnotations(basicDataResult.data, (step: string, progress: number, details?: string) => {
          onProgress?.(`🤖 ${step}`, Math.max(50, progress), details);
        })
      ]);
  
      // Step 4: 병렬 처리 완료
      onProgress?.("🎯 병렬 처리 완료", 75, `더미 AI 주석: ${aiResult.success ? '성공' : '실패'} | 더미 위험요소: ${riskResult.success ? '성공' : '실패'}`);
      await this.delay(200);

      // Step 5: 더미 데이터 통합
      onProgress?.("📋 더미 데이터 통합 및 검증 중", 85, "모든 더미 데이터를 통합하는 중...");
      
      const finalTemplateData: SecuritiesTemplateData = {
        ...basicDataResult.data,  // 더미 기본 회사 데이터
        ...riskResult.data!,       // 더미 투자위험요소 데이터
        ...aiResult.data!         // 더미 AI 생성 주석
      };

      await this.delay(200);

      // Step 6: 저장
      onProgress?.("💾 더미 데이터 저장 중", 95, "생성된 더미 데이터를 저장하는 중...");
      await this.delay(200);

      // Step 7: 완료
      const endTime = Date.now();
      const duration = ((endTime - startTime) / 1000).toFixed(1);
    
      onProgress?.("✅ 완료", 100, `총 ${duration}초 소요 • 더미 AI: ${aiResult.success ? '성공' : '실패'} • 더미 위험요소: ${riskResult.success ? '성공' : '실패'}`);
    
      console.log("🎉 [Complete] 증권신고서 완전 더미 데이터 생성 완료 (병렬 처리)");

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
      console.error("💥 [Fatal Error] 증권신고서 완전 더미 데이터 생성 실패:", error);

      return {
        success: false,
        data: null,
        aiAnnotationState: 'error',
        riskDataState: 'error', 
        error: error.message || "완전 더미 데이터 생성 실패",
        duration: parseFloat(duration)
      };
    }
  }
  
  // 4. 기존 호환성을 위한 메서드
  static async generateSecuritiesData(
    companyCode: string = '01111111',
    onProgress?: (step: string, progress: number) => void
  ): Promise<GenerateSecuritiesDataResponse> {
    const enhancedProgress: ProgressCallback = (step: string, progress: number, details?: string) => {
      onProgress?.(step, progress);
    };

    return await this.generateSecuritiesDataFullyOptimized(companyCode, enhancedProgress);
  }

  // 5. 기본 주석 생성
  static generateDefaultNotes(): AINotesData {
    return {
      S4_NOTE1_1: getDefaultNote(1),
      S4_NOTE1_2: getDefaultNote(2),
      S4_NOTE1_3: getDefaultNote(3),
      S4_NOTE1_4: getDefaultNote(4),
      S4_NOTE1_5: getDefaultNote(5)
    };
  }

  // 6. 더미 AI 주석만 재생성
  static async regenerateAIAnnotations(templateData: Record<string, any>): Promise<SecuritiesServiceResponse<AINotesData>> {
    console.log("🔄 [Regenerate - DUMMY] 더미 AI 주석 재생성 시작");
    return await this.requestEquityAnnotations(templateData);
  }

  // 7. 지분증권 더미 데이터만 가져오기
  static async fetchEquitySecuritiesDataOnly(companyCode: string, onProgress?: ProgressCallback) {
    try {
      onProgress?.("📡 지분증권 더미 데이터 조회 중", 20, "더미 지분증권 데이터를 생성하는 중...");
      
      const result = await this.fetchBasicCompanyData(companyCode, onProgress);
      
      if (result.success && result.data) {
        // 지분증권 관련 데이터만 추출
        const equityData = {
          // 증권의 종류
          securities: {
            S3_2A_1: result.data.S3_2A_1,
            S3_2A_2: result.data.S3_2A_2,
            S3_2A_3: result.data.S3_2A_3,
            S3_2A_4: result.data.S3_2A_4,
            S3_2A_5: result.data.S3_2A_5,
            S3_2A_6: result.data.S3_2A_6,
          },
          // 인수인정보
          underwriter: {
            S3_2C_0: result.data.S3_2C_0,
            S3_2C_1: result.data.S3_2C_1,
            S3_2C_2: result.data.S3_2C_2,
            S3_2C_3: result.data.S3_2C_3,
            S3_2C_4: result.data.S3_2C_4,
            S3_2C_5: result.data.S3_2C_5,
            S3_2C_6: result.data.S3_2C_6,
          },
          // 일반사항
          general: {
            S3_2D_1: result.data.S3_2D_1,
            S3_2D_2: result.data.S3_2D_2,
            S3_2D_3: result.data.S3_2D_3,
            S3_2D_4: result.data.S3_2D_4,
            S3_2D_5: result.data.S3_2D_5,
          },
          // 자금의 사용 목적
          fundUsage: {
            S3_2F_1: result.data.S3_2F_1,
            S3_2F_2: result.data.S3_2F_2,
            S3_2F_DATA: result.data.S3_2F_DATA,
          },
          // 신주인수권에 관한 사항
          stockRights: {
            S3_2G_1: result.data.S3_2G_1,
            S3_2G_2: result.data.S3_2G_2,
          },
          // 매출인에 관한 사항
          sellers: {
            S3_2H_1: result.data.S3_2H_1,
            S3_2H_2: result.data.S3_2H_2,
            S3_2H_3: result.data.S3_2H_3,
            S3_2H_4: result.data.S3_2H_4,
            S3_2H_5: result.data.S3_2H_5,
            S3_2H_DATA: result.data.S3_2H_DATA,
          },
          // 일반청약자환매청구권
          redemption: {
            S3_2I_1: result.data.S3_2I_1,
            S3_2I_2: result.data.S3_2I_2,
            S3_2I_3: result.data.S3_2I_3,
            S3_2I_4: result.data.S3_2I_4,
            S3_2I_5: result.data.S3_2I_5,
          }
        };

        onProgress?.("✅ 더미 지분증권 데이터 추출 완료", 100, "모든 더미 지분증권 데이터가 성공적으로 매핑되었습니다.");
        
        console.log("✅ [Equity Securities] 더미 지분증권 데이터만 추출 완료:", equityData);
        
        return {
          success: true,
          data: equityData
        };
      } else {
        throw new Error(result.error || "더미 지분증권 데이터 로드 실패");
      }
    } catch (error: any) {
      console.error("❌ [Equity Securities Error] 더미 지분증권 데이터 로딩 실패:", error);
      onProgress?.("❌ 더미 지분증권 데이터 로드 실패", 0, error.message);
      
      return {
        success: false,
        error: error.message || "더미 지분증권 데이터 로드 실패",
        data: null
      };
    }
  }

  // 8. 템플릿 변수 매핑 헬퍼 함수
  static mapToTemplateVariables(data: Record<string, any>): Record<string, string> {
    return {
      // 현재 날짜 변수 매핑 
      "{{S1_1A_1}}": data.S1_1A_1 || "",  // 년도
      "{{S1_1A_2}}": data.S1_1A_2 || "",  // 월
      "{{S1_1A_3}}": data.S1_1A_3 || "",  // 일

      // 기본 회사 정보 매핑
      "{{S1_1A_4}}": data.S1_1A_4 || "",  // 회사명
      "{{S1_1A_5}}": data.S1_1A_5 || "",  // 대표이사
      "{{S1_1A_6}}": data.S1_1A_6 || "",  // 주소
      "{{S1_1A_7}}": data.S1_1A_7 || "",  // 전화번호
      "{{S1_1A_8}}": data.S1_1A_8 || "",  // 홈페이지
      "{{S1_1A_C}}": data.S1_1A_C || "",  // 증권종류
      "{{S1_1A_D}}": data.S1_1A_D || "",  // 증권수량
      "{{S1_1A_E}}": data.S1_1A_E || "",  // 모집총액

      // 증권의 종류 매핑
      "{{S3_2A_1}}": data.S3_2A_1 || "",
      "{{S3_2A_2}}": data.S3_2A_2 || "",
      "{{S3_2A_3}}": data.S3_2A_3 || "",
      "{{S3_2A_4}}": data.S3_2A_4 || "",
      "{{S3_2A_5}}": data.S3_2A_5 || "",
      "{{S3_2A_6}}": data.S3_2A_6 || "",

      // 인수인정보 매핑
      "{{S3_2C_0}}": data.S3_2C_0 || "",
      "{{S3_2C_1}}": data.S3_2C_1 || "",
      "{{S3_2C_2}}": data.S3_2C_2 || "",
      "{{S3_2C_3}}": data.S3_2C_3 || "",
      "{{S3_2C_4}}": data.S3_2C_4 || "",
      "{{S3_2C_5}}": data.S3_2C_5 || "",
      "{{S3_2C_6}}": data.S3_2C_6 || "",

      // 일반사항 매핑
      "{{S3_2D_1}}": data.S3_2D_1 || "",
      "{{S3_2D_2}}": data.S3_2D_2 || "",
      "{{S3_2D_3}}": data.S3_2D_3 || "",
      "{{S3_2D_4}}": data.S3_2D_4 || "",
      "{{S3_2D_5}}": data.S3_2D_5 || "",

      // 자금사용목적 매핑
      "{{S3_2F_1}}": data.S3_2F_1 || "",
      "{{S3_2F_2}}": data.S3_2F_2 || "",

      // 신주인수권 매핑
      "{{S3_2G_1}}": data.S3_2G_1 || "",
      "{{S3_2G_2}}": data.S3_2G_2 || "",

      // 매출인정보 매핑
      "{{S3_2H_1}}": data.S3_2H_1 || "",
      "{{S3_2H_2}}": data.S3_2H_2 || "",
      "{{S3_2H_3}}": data.S3_2H_3 || "",
      "{{S3_2H_4}}": data.S3_2H_4 || "",
      "{{S3_2H_5}}": data.S3_2H_5 || "",

      // 환매청구권 매핑
      "{{S3_2I_1}}": data.S3_2I_1 || "",
      "{{S3_2I_2}}": data.S3_2I_2 || "",
      "{{S3_2I_3}}": data.S3_2I_3 || "",
      "{{S3_2I_4}}": data.S3_2I_4 || "",
      "{{S3_2I_5}}": data.S3_2I_5 || "",

      // 투자위험요소 매핑
      "{{S3_1A_1}}": data.S3_1A_1 || "",
      "{{S3_1B_1}}": data.S3_1B_1 || "",
      "{{S3_1C_1}}": data.S3_1C_1 || "",

      // AI 생성 주석 매핑
      "{{S4_NOTE1_1}}": data.S4_NOTE1_1 || "",
      "{{S4_NOTE1_2}}": data.S4_NOTE1_2 || "",
      "{{S4_NOTE1_3}}": data.S4_NOTE1_3 || "",
      "{{S4_NOTE1_4}}": data.S4_NOTE1_4 || "",
      "{{S4_NOTE1_5}}": data.S4_NOTE1_5 || "",

      // 레거시 증권 정보 매핑 (S4_11 시리즈)
      "{{S4_11A_1}}": data.S4_11A_1 || "",
      "{{S4_11A_2}}": data.S4_11A_2 || "",
      "{{S4_11A_3}}": data.S4_11A_3 || "",
      "{{S4_11A_4}}": data.S4_11A_4 || "",
      "{{S4_11A_5}}": data.S4_11A_5 || "",
      "{{S4_11A_6}}": data.S4_11A_6 || "",

      "{{S4_11B_1}}": data.S4_11B_1 || "",
      "{{S4_11B_2}}": data.S4_11B_2 || "",
      "{{S4_11B_3}}": data.S4_11B_3 || "",
      "{{S4_11B_4}}": data.S4_11B_4 || "",
      "{{S4_11B_5}}": data.S4_11B_5 || "",
      "{{S4_11B_6}}": data.S4_11B_6 || "",
      "{{S4_11B_7}}": data.S4_11B_7 || "",

      "{{S4_11C_1}}": data.S4_11C_1 || "",
      "{{S4_11C_2}}": data.S4_11C_2 || "",
      "{{S4_11C_3}}": data.S4_11C_3 || "",
      "{{S4_11C_4}}": data.S4_11C_4 || "",
      "{{S4_11C_5}}": data.S4_11C_5 || "",
    };
  }

  // 9. 배열 데이터를 테이블 형태로 변환하는 헬퍼 함수
  static generateFundUsageTable(fundUsageData: Array<{se: string, amt: string}>): string {
    if (!fundUsageData || fundUsageData.length === 0) {
      return "<tr><td colspan='2'>자금사용 목적 정보가 없습니다.</td></tr>";
    }

    return fundUsageData.map(item => 
      `<tr><td>${item.se}</td><td>${item.amt}</td></tr>`
    ).join('\n');
  }

  static generateSellersTable(sellersData: Array<{hdr: string, rlCmp: string, bfslHdstk: string, slstk: string, atslHdstk: string}>): string {
    if (!sellersData || sellersData.length === 0) {
      return "<tr><td colspan='5'>매출인 정보가 없습니다.</td></tr>";
    }

    return sellersData.map(item => 
      `<tr>
        <td>${item.hdr}</td>
        <td>${item.rlCmp}</td>
        <td>${item.bfslHdstk}</td>
        <td>${item.slstk}</td>
        <td>${item.atslHdstk}</td>
      </tr>`
    ).join('\n');
  }

  // 10. 현재 날짜 변수만 별도로 가져오는 유틸리티 함수
  static getCurrentDateVariables() {
    return getCurrentDateVariables();
  }

  // 11. 날짜 포맷팅 옵션을 제공하는 함수
  static getFormattedCurrentDate(format: 'YYYY.MM.DD' | 'YYYY년 M월 D일' | 'separate' = 'separate') {
    const now = new Date();
    const year = now.getFullYear().toString();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    switch (format) {
      case 'YYYY.MM.DD':
        return `${year}.${month}.${day}`;
      case 'YYYY년 M월 D일':
        return `${year}년 ${parseInt(month)}월 ${parseInt(day)}일`;
      case 'separate':
      default:
        return { year, month, day };
    }
  }

  // ========================================
  // 🚫 실제 API 연동 함수들 (완전히 제거됨)
  // ========================================
  
  // 기존 실제 API 함수들은 모두 제거하고 더미로만 동작
  // fetchRiskDataFromAPI, requestEquityAnnotationsFromAPI 등은 삭제됨

  // ========================================
  // 🎯 더미 전용 유틸리티 함수들
  // ========================================

  // 12. 더미 데이터 검증 함수
  static validateDummyData(data: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!data) {
      errors.push("데이터가 없습니다");
      return { isValid: false, errors };
    }

    // 필수 필드 검증
    const requiredFields = [
      'company_name', 'S3_2A_1', 'S3_2A_2', 'S3_2A_5',
      'S3_1A_1', 'S4_NOTE1_1'
    ];

    requiredFields.forEach(field => {
      if (!data[field]) {
        errors.push(`필수 필드 누락: ${field}`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // 13. 더미 데이터 요약 정보 생성
  static generateDummyDataSummary(data: SecuritiesTemplateData): string {
    const validation = this.validateDummyData(data);
    
    return `
🎯 더미 데이터 생성 완료 요약
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 회사정보: ${data.company_name} (${data.corp_code})
💰 발행규모: ${data.S3_2A_5} (${data.S3_2A_2}주)
🔍 AI주석: ${data.S4_NOTE1_1 ? '생성완료' : '생성실패'}
⚠️ 위험요소: ${data.S3_1A_1 ? '생성완료' : '생성실패'}
✅ 데이터 유효성: ${validation.isValid ? '정상' : '오류'}
${validation.errors.length > 0 ? `❌ 오류: ${validation.errors.join(', ')}` : ''}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;
  }

  // 14. 더미 모드 상태 확인
  static isDummyMode(): boolean {
    return true; // 항상 더미 모드
  }

  // 15. 더미 데이터 재설정 (테스트용)
  static resetDummyData(): void {
    console.log("🔄 [Reset] 더미 데이터 상태를 초기화했습니다.");
    // 필요시 캐시 클리어 등의 작업
  }
}