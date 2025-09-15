// dartViewerApi.ts
import axios from './axios';

export const dartViewerApi = {
  fetchAllCompanies: async (user_id: number) => {
    try {
      const response = await axios.get('/api/versions/companies', {
        params: { userId: user_id }
      });
      return response.data;
    } catch (error: any) {
      throw new Error("Failed to fetch companies");
    }
  },

  fetchCompanyVersions: async (payload: { user_id: number; corp_code: string }) => {
    try {
      const response = await axios.post('/api/versions/search', payload);
      return response.data;
    } catch (error: any) {
      throw new Error("Failed to fetch versions");
    }
  },

  createVersion: async (payload: unknown) => {
    try {
      console.log('🌐 [API] createVersion 요청 시작');
      console.log('🌐 [API] 페이로드 크기:', JSON.stringify(payload).length.toLocaleString(), 'bytes');
      console.log('🌐 [API] 페이로드 크기:', (JSON.stringify(payload).length / 1024 / 1024).toFixed(2), 'MB');
      
      const response = await axios.post('/api/versions', payload);
      
      console.log('🌐 [API] 요청 성공:', response.status);
      return response.data;
      
    } catch (error: any) {
      console.error('🌐 [API] createVersion 실패:', error);
      
      if (error.response) {
        // 서버가 응답했지만 에러 상태 코드
        const status = error.response.status;
        const data = error.response.data;
        const statusText = error.response.statusText;
        
        console.error('🌐 [API] 서버 응답 에러:', {
          status,
          statusText,
          data
        });
        
        // 상태 코드별 구체적인 에러 메시지
        switch (status) {
          case 400:
            throw new Error(`잘못된 요청 (400): ${JSON.stringify(data)}`);
          case 401:
            throw new Error('인증이 필요합니다 (401). 다시 로그인해주세요.');
          case 403:
            throw new Error('권한이 없습니다 (403)');
          case 413:
            throw new Error('요청 데이터가 너무 큽니다 (413). 데이터 크기를 줄여주세요.');
          case 500:
            throw new Error(`서버 내부 오류 (500): ${JSON.stringify(data)}`);
          case 502:
            throw new Error('Bad Gateway (502): 서버가 응답하지 않습니다.');
          case 503:
            throw new Error('서비스 사용 불가 (503): 서버가 일시적으로 사용할 수 없습니다.');
          case 504:
            throw new Error('Gateway Timeout (504): 서버 응답 시간이 초과되었습니다.');
          default:
            throw new Error(`HTTP ${status} 오류: ${JSON.stringify(data)}`);
        }
        
      } else if (error.request) {
        // 요청이 전송되었지만 응답을 받지 못함
        console.error('🌐 [API] 응답 없음:', error.request);
        throw new Error('서버로부터 응답을 받지 못했습니다. 네트워크 연결을 확인해주세요.');
        
      } else {
        // 요청 설정 중 오류 발생
        console.error('🌐 [API] 요청 설정 오류:', error.message);
        throw new Error(`요청 오류: ${error.message}`);
      }
    }
  },

  finalizeVersion: async (payload: unknown) => {
    try {
      const response = await axios.post('/api/versions/finalize', payload);
      return response.data;
    } catch (error: any) {
      throw new Error("Failed to finalize!");
    }
  },

  updateEditingVersion: async (payload: unknown) => {
    try {
      const response = await axios.post('/api/versions/editing', payload);
      return response.data;
    } catch (error: any) {
      throw new Error("Fail to patch");
    }
  },

  patchEditingVersion: async (payload: unknown) => {
    try {
      const response = await axios.patch('/api/versions/editing', payload);
      return response.data;
    } catch (error: any) {
      throw new Error("Fail to patch");
    }
  },

  deleteVersion: async (payload: unknown) => {
    try {
      const response = await axios.delete('/api/versions', { data: payload });
      return response;
    } catch (error: any) {
      throw new Error("Fail to delete");
    }
  },

  deleteCompany: async (payload: unknown) => {
    try {
      const response = await axios.delete('/api/versions/company', { data: payload });
      return response;
    } catch (error: any) {
      throw new Error("Fail to delete");
    }
  },

  validateSection: async (payload: { indutyName: string; section: string; draft: string }) => {
    try {
      const response = await axios.post('api/validation/check', payload);
      return response.data;
    } catch (error: any) {
      throw new Error("Failed to validate section");
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
      const response = await axios.post('api/validation/revise', payload);
      return response.data;
    } catch (error: any) {
      throw new Error("Failed to revise section");
    }
  }
};