import axios from './axios';
import type { 
  CompanyDataResponse, 
  AIAnnotationRequest, 
  AIAnnotationResponse 
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

  // AI API - 주식 공모 주석 생성
  generateEquityAnnotations: async (requestData: AIAnnotationRequest): Promise<AIAnnotationResponse> => {    
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
  }
};