const getToken = () => localStorage.getItem("accessToken");

/** 공통 헤더 생성 함수 */
const makeHeaders = (): HeadersInit => {
  const headers: HeadersInit = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

export const dartViewerApi = {
  fetchAllCompanies: async (user_id: number) => {
    const res = await fetch(`http://localhost:8080/api/versions?user_id=${user_id}`, {
      method: "GET",
      headers: makeHeaders()
    });
    if (!res.ok) {
      throw new Error("Failed to fetch companies");
    }
    return res.json();
  },

  fetchCompanyVersions: async (payload: { user_id: number; corp_code: string }) => {
    const res = await fetch(`http://localhost:8080/api/versions/search`, {
      method: "POST",
      headers: makeHeaders(),
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      throw new Error("Failed to fetch versions");
    }

    return res.json();
  },

  createVersion: async (payload: unknown) => {
    const res = await fetch('http://localhost:8080/api/versions', {
      method: 'POST',
      headers: makeHeaders(),
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      throw new Error("Failed to create!")
    }
    
    return res.json();
  },

  finalizeVersion: async (payload: unknown) => {
    const res = await fetch('http://localhost:8080/api/versions/finalize', {
      method: 'POST',
      headers: makeHeaders(),
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      throw new Error("Failed to finalize!")
    }

    return res.json();
  },

  updateEditingVersion: async (payload: unknown) => {
    const res = await fetch('http://localhost:8080/api/versions/editing', {
      method: 'POST',
      headers: makeHeaders(),
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      throw new Error("Fail to patch")
    }

    return res.json();
  },

  patchEditingVersion: async (payload: unknown) => {
    const res = await fetch('http://localhost:8080/api/versions/editing', {
      method: 'PATCH',
      headers: makeHeaders(),
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      throw new Error("Fail to patch")
    }

    return res.json();
  },

  deleteEditingVersion: async (payload: unknown) => {
    const res = await fetch(`http://localhost:8080/api/versions/editing`, {
      method: 'DELETE',
      headers: makeHeaders(),
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      throw new Error("Fail to delete")
    }

    return res;
  },

  validateSection: async (payload: { indutyName: string; section: string; draft: string }) => {
    const res = await fetch('http://localhost:8081/check', {
      method: 'POST',
      headers: makeHeaders(),
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      throw new Error("Failed to validate section")
    }

    return res.json();
  },

  reviseSection: async (payload: { 
    span: string, reason: string, rule_id: string, evidence: string, suggestion: string, severity: string
  }) => {
    const res = await fetch('http://localhost:8081/revise', {
      method: 'POST',
      headers: makeHeaders(),
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      throw new Error("Failed to revise section")
    }

    return res.text();
  }
};