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

// 검증 API를 위한 별도 axios 인스턴스
const validationApi = axios.create({
  baseURL: process.env.REACT_APP_AI_URL || "http://k8s-default-ingress-164f943143-1841556789.ap-northeast-2.elb.amazonaws.com/ai",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json", // JSON 응답 요청
  },
  withCredentials: true,
});

// 검증 API에도 토큰 인터셉터 적용
validationApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // JSON 헤더 확실히 설정
    config.headers['Accept'] = 'application/json';
    config.headers['Content-Type'] = 'application/json';
    return config;
  },
  (error) => Promise.reject(error)
);

// 공통 응답 검증 함수
const validateJsonResponse = (response: any, apiName: string) => {
  // HTML 응답 체크
  if (typeof response.data === 'string' && response.data.includes('<html>')) {
    console.error(`🚨 ${apiName}: HTML 응답 받음 - 예상: JSON`);
    throw new Error(`${apiName}: 서버에서 HTML 응답을 받았습니다. JSON이 예상되었습니다.`);
  }
  
  // 상태 코드 체크
  if (response.status !== 200) {
    throw new Error(`${apiName}: HTTP ${response.status} 오류`);
  }
  
  // 데이터 존재 체크
  if (!response.data) {
    throw new Error(`${apiName}: 응답 데이터가 없습니다`);
  }
};

// 공통 응답 인터셉터
validationApi.interceptors.response.use(
  (response) => {
    console.log(`✅ AI API Response:`, {
      url: response.config.url,
      status: response.status,
      contentType: response.headers['content-type'],
      dataType: typeof response.data
    });
    return response;
  },
  (error) => {
    console.error(`❌ AI API Error:`, {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message
    });
    return Promise.reject(error);
  }
);

export const securitiesApi = {
  fetchCompanyData: async (companyCode: string): Promise<CompanyDataResponse> => {
    try {
      console.log(`🔄 회사 데이터 요청: ${companyCode}`);
      const response = await axios.get(`/api/dart/test/${companyCode}/all-data`);
      
      // 응답 검증
      validateJsonResponse(response, 'fetchCompanyData');
      
      if (response.data && response.data.status === "SUCCESS") {
        console.log(`✅ 회사 데이터 성공: ${companyCode}`);
        return response.data;
      } else {
        throw new Error("DART API 응답 상태가 성공이 아닙니다.");
      }
    } catch (error: any) {
      console.error(`❌ 회사 데이터 실패: ${companyCode}`, error);
      throw new Error(`DART API 호출 실패: ${error.message}`);
    }
  },

  fetchEtcMatters: async (corpName: string): Promise<EtcMattersResponse> => {
    try {
      console.log(`🔄 기타사항 요청: ${corpName}`);
      const response = await axios.get('/api/dart/reports/etc-matters', {
        params: {
          corp_name: corpName
        }
      });
      
      // 응답 검증
      validateJsonResponse(response, 'fetchEtcMatters');
      
      console.log(`✅ 기타사항 성공: ${corpName}`);
      return response.data;
    } catch (error: any) {
      console.error(`❌ 기타사항 실패: ${corpName}`, error);
      throw new Error(`기타사항 보고서 API 호출 실패: ${error.message}`);
    }
  },

  fetchRiskData: async (companyCode: string): Promise<RiskData> => {
    try {
      console.log(`🔄 리스크 데이터 요청: ${companyCode}`);
      const response = await axios.get(`/api/v1/variables/mapping/${companyCode}`);
      
      // 응답 검증
      validateJsonResponse(response, 'fetchRiskData');
      
      // 실제 데이터는 response.data.data에 있음
      if (response.data.result === 'SUCCESS' && response.data.data) {
        console.log(`✅ 리스크 데이터 성공: ${companyCode}`);
        return response.data.data;  // 실제 RiskData 반환
      } else {
        throw new Error(`변수 매핑 실패: ${response.data.message || '알 수 없는 오류'}`);
      }
    } catch (error: any) {
      console.error(`❌ 리스크 데이터 실패: ${companyCode}`, error);
      throw new Error(`변수 매핑 API 호출 실패: ${error.message}`);
    }
  },

  // AI API - 주식 공모 주석 생성
  generateEquityAnnotations: async (requestData: AIAnnotationRequest): Promise<AINotesData> => {    
    try {
      console.log(`🤖 AI 주석 생성 요청 시작`);
      const response = await axios.post('/api/ai/equity-annotation', requestData);
      
      // 응답 검증
      validateJsonResponse(response, 'generateEquityAnnotations');
      
      console.log(`✅ AI 주석 생성 성공`);
      return response.data;
    } catch (error: any) {
      console.error(`❌ AI 주석 생성 실패`, error);
      throw new Error(`AI API 호출 실패: ${error.message}`);
    }
  },

  getBizReport: async (companyCode: string): Promise<BizData> => {
    try {
      console.log(`🔄 사업보고서 요청: ${companyCode}`);
      const response = await axios.get(`/api/dart/reports/latest?corp_code=${companyCode}`);
      
      // 응답 검증
      validateJsonResponse(response, 'getBizReport');
      
      console.log("DART 보고서 응답:", response.data);
      console.log(`✅ 사업보고서 성공: ${companyCode}`);
      return response.data.data;
    } catch (error: any) {
      console.error(`❌ 사업보고서 실패: ${companyCode}`, error);
      throw new Error(`DART API 호출 실패: ${error.message}`);
    }
  },

  validateSection: async (payload: { indutyName: string; section: string; draft: string }) => {
    try {
      console.log(`🔄 섹션 검증 요청 시작`);
      const response = await validationApi.post('/check', payload);
      
      // 응답 검증
      validateJsonResponse(response, 'validateSection');
      
      console.log(`✅ 섹션 검증 성공`);
      return response.data;
    } catch (error: any) {
      console.error(`❌ 섹션 검증 실패`, error);
      throw new Error(`섹션 검증 실패: ${error.message}`);
    }
  },

  reviseSection: async (payload: { 
    span: string, 
    reason: string, 
    rule_id: string, 
    evidence: string, 
    suggestion: string, 
    severity: string 
  }) => {
    try {
      console.log(`🔄 섹션 수정 요청 시작`);
      const response = await validationApi.post('/revise', payload);
      
      // 응답 검증 (이 API는 텍스트 응답일 수 있음)
      if (response.status !== 200) {
        throw new Error(`HTTP ${response.status} 오류`);
      }
      
      // HTML 체크만 수행 (텍스트 응답 허용)
      if (typeof response.data === 'string' && response.data.includes('<html>')) {
        console.error(`🚨 reviseSection: HTML 응답 받음`);
        throw new Error('reviseSection: 서버에서 HTML 응답을 받았습니다.');
      }
      
      console.log(`✅ 섹션 수정 성공`);
      // 서버가 단순 텍스트를 반환하므로 data를 직접 반환
      return response.data;
    } catch (error: any) {
      console.error(`❌ 섹션 수정 실패`, error);
      throw new Error(`섹션 수정 실패: ${error.message}`);
    }
  }
};