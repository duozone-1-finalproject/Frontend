// dartViewerApi.ts (axios 방식으로 변경)
import axios from './axios';

// 검증 API용 별도 axios 인스턴스
const validationAxios = axios.create({
  baseURL: process.env.REACT_APP_VALIDATION_API_URL || "http://localhost:8081",
  headers: {
    "Content-Type": "application/json",
  },
});

// 토큰 인터셉터 추가
validationAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const dartViewerApi = {
  fetchVersions: async (userId: number) => {
    try {
      console.log('🔍 fetchVersions 호출, userId:', userId);
      console.log('🔍 axios baseURL:', axios.defaults.baseURL);
      
      const response = await axios.get(`/api/versions?userId=${userId}`, {
        headers: { "Cache-Control": "no-store" }
      });
      
      console.log('✅ fetchVersions 성공:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ fetchVersions 실패:', error);
      console.error('❌ Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: error.config
      });
      
      if (error.response) {
        throw new Error(`API Error (${error.response.status}): ${error.response.data?.message || error.message}`);
      } else if (error.request) {
        throw new Error(`Network Error: 서버에 연결할 수 없습니다`);
      } else {
        throw new Error(`Request Error: ${error.message}`);
      }
    }
  },

  createVersion: async (payload: unknown) => {
    try {
      const response = await axios.post('/api/versions', payload);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to create version");
    }
  },

  finalizeVersion: async (payload: unknown) => {
    try {
      const response = await axios.post('/api/versions/finalize', payload);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to finalize version");
    }
  },

  updateEditingVersion: async (payload: unknown) => {
    try {
      const response = await axios.post('/api/versions/editing', payload);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to update editing version");
    }
  },

  patchEditingVersion: async (payload: unknown) => {
    try {
      const response = await axios.patch('/api/versions/editing', payload);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to patch editing version");
    }
  },

  deleteEditingVersion: async (userId: number) => {
    try {
      const response = await axios.delete('/api/versions/editing', {
        data: { user_id: userId }
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to delete editing version");
    }
  },

  validateSection: async (payload: { indutyName: string; section: string; draft: string }) => {
    try {
      const response = await validationAxios.post('/check', payload);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to validate section");
    }
  },

  reviseSection: async (payload: { 
    span: string, reason: string, rule_id: string, evidence: string, suggestion: string, severity: string
  }) => {
    try {
      const response = await validationAxios.post('/revise', payload);
      // 서버가 단순 텍스트를 반환하므로 response.data 사용
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to revise section");
    }
  }
};