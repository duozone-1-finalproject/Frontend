import axios from './axios';

// 검증 API를 위한 별도 axios 인스턴스
const validationApi = axios.create({
  baseURL: process.env.REACT_APP_AI_URL || "http://k8s-default-ingress-164f943143-1841556789.ap-northeast-2.elb.amazonaws.com/ai",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json", // JSON 응답 요청
  },
  withCredentials: true,
});

// 공통 응답 검증 함수
const validateJsonResponse = (response: any, apiName: string) => {
  // HTML 응답 체크
  if (typeof response.data === 'string' && (
    response.data.includes('<html>') || 
    response.data.includes('<!DOCTYPE') ||
    response.data.includes('<form') ||
    response.data.includes('login')
  )) {
    console.error(`🚨 ${apiName}: HTML 응답 받음 - 예상: JSON`);
    throw new Error(`${apiName}: 서버에서 HTML 응답을 받았습니다. API 엔드포인트를 확인하세요.`);
  }
  
  // 상태 코드 체크
  if (response.status < 200 || response.status >= 300) {
    throw new Error(`${apiName}: HTTP ${response.status} 오류`);
  }
  
  console.log(`✅ ${apiName}: 유효한 응답 확인됨`);
};

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

// 응답 인터셉터 - HTML 감지
validationApi.interceptors.response.use(
  (response) => {
    console.log(`✅ AI API Response:`, {
      url: response.config.url,
      status: response.status,
      contentType: response.headers['content-type'],
      dataType: typeof response.data
    });
    
    // HTML 응답 감지
    if (typeof response.data === 'string' && response.data.includes('<html>')) {
      console.warn(`🚨 AI API HTML 응답 감지: ${response.config.url}`);
    }
    
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

export const dartViewerApi = {
  fetchVersions: async (userId: number) => {
    try {
      console.log(`🔄 버전 목록 요청: userId=${userId}`);
      const response = await axios.get(`/api/versions`, {
        params: { userId }
      });
      
      validateJsonResponse(response, 'fetchVersions');
      console.log(`✅ 버전 목록 성공: ${response.data?.length || 0}개`);
      
      return response.data;
    } catch (error: any) {
      console.error(`❌ 버전 목록 실패:`, error);
      throw new Error(`버전 목록 조회 실패: ${error.message}`);
    }
  },

  createVersion: async (payload: unknown) => {
    try {
      console.log(`🔄 버전 생성 요청`);
      const response = await axios.post('/api/versions', payload);
      
      validateJsonResponse(response, 'createVersion');
      console.log(`✅ 버전 생성 성공`);
      
      return response.data;
    } catch (error: any) {
      console.error(`❌ 버전 생성 실패:`, error);
      throw new Error(`버전 생성 실패: ${error.message}`);
    }
  },

  finalizeVersion: async (payload: unknown) => {
    try {
      console.log(`🔄 버전 완료 요청`);
      const response = await axios.post('/api/versions/finalize', payload);
      
      validateJsonResponse(response, 'finalizeVersion');
      console.log(`✅ 버전 완료 성공`);
      
      return response.data;
    } catch (error: any) {
      console.error(`❌ 버전 완료 실패:`, error);
      throw new Error(`버전 완료 실패: ${error.message}`);
    }
  },

  updateEditingVersion: async (payload: unknown) => {
    try {
      console.log(`🔄 편집 버전 업데이트 요청`);
      const response = await axios.post('/api/versions/editing', payload);
      
      validateJsonResponse(response, 'updateEditingVersion');
      console.log(`✅ 편집 버전 업데이트 성공`);
      
      return response.data;
    } catch (error: any) {
      console.error(`❌ 편집 버전 업데이트 실패:`, error);
      throw new Error(`편집 버전 업데이트 실패: ${error.message}`);
    }
  },

  patchEditingVersion: async (payload: unknown) => {
    try {
      console.log(`🔄 편집 버전 패치 요청`);
      const response = await axios.patch('/api/versions/editing', payload);
      
      validateJsonResponse(response, 'patchEditingVersion');
      console.log(`✅ 편집 버전 패치 성공`);
      
      return response.data;
    } catch (error: any) {
      console.error(`❌ 편집 버전 패치 실패:`, error);
      throw new Error(`편집 버전 패치 실패: ${error.message}`);
    }
  },

  deleteEditingVersion: async (userId: number) => {
    try {
      console.log(`🔄 편집 버전 삭제 요청: userId=${userId}`);
      const response = await axios.delete('/api/versions/editing', {
        data: {
          user_id: userId,
        }
      });
      
      validateJsonResponse(response, 'deleteEditingVersion');
      console.log(`✅ 편집 버전 삭제 성공`);
      
      return response;
    } catch (error: any) {
      console.error(`❌ 편집 버전 삭제 실패:`, error);
      throw new Error(`편집 버전 삭제 실패: ${error.message}`);
    }
  },

  validateSection: async (payload: { indutyName: string; section: string; draft: string }) => {
    try {
      console.log(`🔄 섹션 검증 요청`);
      const response = await validationApi.post('/check', payload);
      
      validateJsonResponse(response, 'validateSection');
      console.log(`✅ 섹션 검증 성공`);
      
      return response.data;
    } catch (error: any) {
      console.error(`❌ 섹션 검증 실패:`, error);
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
      console.log(`🔄 섹션 수정 요청`);
      const response = await validationApi.post('/revise', payload);
      
      // 이 API는 텍스트 응답일 수 있으므로 HTML 체크만 수행
      if (response.status < 200 || response.status >= 300) {
        throw new Error(`HTTP ${response.status} 오류`);
      }
      
      // HTML 응답 체크
      if (typeof response.data === 'string' && response.data.includes('<html>')) {
        console.error(`🚨 reviseSection: HTML 응답 받음`);
        throw new Error('reviseSection: 서버에서 HTML 응답을 받았습니다.');
      }
      
      console.log(`✅ 섹션 수정 성공`);
      
      // 서버가 단순 텍스트를 반환하므로 data를 직접 반환
      return response.data;
    } catch (error: any) {
      console.error(`❌ 섹션 수정 실패:`, error);
      throw new Error(`섹션 수정 실패: ${error.message}`);
    }
  }
};