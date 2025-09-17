// dartViewerApi.ts
import axios from './axios';

// 검증 API를 위한 별도 axios 인스턴스
const validationApi = axios.create({
  baseURL: process.env.REACT_APP_AI_URL || "http://k8s-default-ingress-164f943143-1841556789.ap-northeast-2.elb.amazonaws.com/ai",
  headers: {
    "Content-Type": "application/json",
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
    return config;
  },
  (error) => Promise.reject(error)
);

// 공통 응답 인터셉터 (선택사항)
validationApi.interceptors.response.use(
  (response) => response,
  (error) => {
    // 공통 에러 처리 로직 필요시 여기에 추가
    return Promise.reject(error);
  }
);

export const dartViewerApi = {
  fetchVersions: async (userId: number) => {
    try {
      const response = await axios.get(`/api/versions`, {
        params: { userId }
      });
      return response.data;
    } catch (error: any) {
      throw new Error("Failed to fetch versions");
    }
  },

  createVersion: async (payload: unknown) => {
    try {
      const response = await axios.post('/api/versions', payload);
      return response.data;
    } catch (error: any) {
      throw new Error("Failed to create!");
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

  deleteEditingVersion: async (userId: number) => {
    try {
      const response = await axios.delete('/api/versions/editing', {
        data: {
          user_id: userId,
        }
      });
      return response;
    } catch (error: any) {
      throw new Error("Fail to delete");
    }
  },

  validateSection: async (payload: { indutyName: string; section: string; draft: string }) => {
    try {
      const response = await validationApi.post('/check', payload);
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
      const response = await validationApi.post('/revise', payload);
      // 서버가 단순 텍스트를 반환하므로 data를 직접 반환
      return response.data;
    } catch (error: any) {
      throw new Error("Failed to revise section");
    }
  }
};