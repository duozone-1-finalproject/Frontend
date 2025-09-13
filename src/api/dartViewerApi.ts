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
  fetchVersions: async (userId: number) => {
    const res = await fetch(`http://localhost:8080/api/versions?userId=${userId}`, {
      method: "GET",
      headers: makeHeaders(),
      cache: "no-store",
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

  deleteEditingVersion: async (userId: number) => {
    const res = await fetch(`http://localhost:8080/api/versions/editing`, {
      method: 'DELETE',
      headers: makeHeaders(),
      body: JSON.stringify({
        user_id: userId,
      })
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

    // 서버가 단순 텍스트를 반환하므로 text()로 받기
    return res.text();
  }
};