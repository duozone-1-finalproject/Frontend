import axios from './axios';
import type { 
  CompanyDataResponse, 
  AIAnnotationRequest, 
  AINotesData, 
  RiskData,
  EtcMattersResponse,
  BizReportResponse,
  BizData
} from '../types/securities';

// Securities API 객체
export const securitiesApi = {
  fetchCompanyData: async (companyCode: string): Promise<CompanyDataResponse> => {
    try {
      const response = await axios.get(`/api/dart/test/${companyCode}/all-data`);
      
      if (response.data && response.data.status === "SUCCESS") {
        return response.data;
      } else {
        throw new Error("DART API 응답 상태가 성공이 아닙니다.");
      }
    } catch (error: any) {
      throw new Error(`DART API 호출 실패: ${error.message}`);
    }
  },

  fetchEtcMatters: async (corpName: string): Promise<EtcMattersResponse> => {
    try {
      const response = await axios.get('/api/dart/reports/etc-matters', {
        params: {
          corp_name: corpName
        }
      });
      
      if (response.data && response.status === 200) {
        return response.data;
      } else {
        throw new Error("기타사항 보고서 API 응답 오류");
      }
    } catch (error: any) {
      throw new Error(`기타사항 보고서 API 호출 실패: ${error.message}`);
    }
  },

  fetchRiskData: async (companyCode: string): Promise<RiskData> => {
    try {
      const response = await axios.get(`/api/v1/variables/mapping/${companyCode}`);
      
      if (response.data && response.status === 200) {
        // 🔥 실제 데이터는 response.data.data에 있음
        if (response.data.result === 'SUCCESS' && response.data.data) {
          return response.data.data;  // 실제 RiskData 반환
        } else {
          throw new Error(`변수 매핑 실패: ${response.data.message || '알 수 없는 오류'}`);
        }
      } else {
        throw new Error("변수 매핑 API 응답 오류");
      }
    } catch (error: any) {
      throw new Error(`변수 매핑 API 호출 실패: ${error.message}`);
    }
  },

  // AI API - 주식 공모 주석 생성
  generateEquityAnnotations: async (requestData: AIAnnotationRequest): Promise<AINotesData> => {    
    try {
      const response = await axios.post('/api/ai/equity-annotation', requestData);
      
      if (response.data && response.status === 200) {
        return response.data;
      } else {
        throw new Error("AI 주석 생성 API 응답 오류");
      }
    } catch (error: any) {
      throw new Error(`AI API 호출 실패: ${error.message}`);
    }
  },

  getBizReport: async (companyCode: string): Promise<BizData> => {
    try {
      const response = await axios.get(`/api/dart/reports/latest?corp_code=${companyCode}`);
      
      console.log("DART 보고서 응답:", response.data);
      if (response.data && response.status === 200) {
        return response.data.data;
      } else {
        throw new Error("DART 보고서 API 응답 오류");
      }
    } catch (error: any) {
      throw new Error(`DART API 호출 실패: ${error.message}`);
    }
  }
};
