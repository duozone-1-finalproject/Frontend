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