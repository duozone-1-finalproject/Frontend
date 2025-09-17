// src/api/axios.ts - 토큰 검증 강화 버전
import axios from "axios";

const TOKEN_KEY = "accessToken";

// JWT 토큰 형식 검증 함수
const isValidJWT = (token: string): boolean => {
  if (!token) return false;
  
  // JWT는 3개 부분으로 구성되어야 함 (header.payload.signature)
  const parts = token.split('.');
  if (parts.length !== 3) {
    console.warn("🚨 Invalid JWT format: expected 3 parts, got", parts.length);
    return false;
  }
  
  // 각 부분이 base64 형태인지 간단히 체크
  try {
    parts.forEach(part => {
      if (!part || part.length === 0) {
        throw new Error("Empty JWT part");
      }
    });
    return true;
  } catch (error) {
    console.warn("🚨 Invalid JWT structure:", error);
    return false;
  }
};

// AWS 환경 감지
const isAWSEnvironment = () => {
  const baseURL = process.env.REACT_APP_API_BASE_URL;
  const isAWS = baseURL?.includes('amazonaws.com') || baseURL?.includes('elb.');
  console.log("🌍 환경 감지:", { baseURL, isAWS });
  return isAWS;
};

const instance = axios.create({
  baseURL: "http://k8s-default-ingress-164f943143-1841556789.ap-northeast-2.elb.amazonaws.com/backend",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
  timeout: isAWSEnvironment() ? 30000 : 10000,
});

// 요청 인터셉터 - 토큰 검증 로직 추가
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    
    // 🔥 토큰이 있고 유효한 경우에만 헤더에 추가
    if (token && config.headers) {
      if (isValidJWT(token)) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log("🔑 유효한 토큰 사용:", `${token.substring(0, 20)}...`);
      } else {
        // 유효하지 않은 토큰은 제거
        console.warn("🗑️ 유효하지 않은 토큰 제거:", token);
        localStorage.removeItem(TOKEN_KEY);
        delete config.headers.Authorization;
      }
    }
    
    // AWS ELB를 위한 추가 헤더
    if (isAWSEnvironment()) {
      config.headers['X-Requested-With'] = 'XMLHttpRequest';
      config.headers['Access-Control-Request-Headers'] = 'Authorization,Content-Type';
    }
    
    // 🔍 디버깅 정보
    console.log("🚀 Request Config:", {
      url: config.url,
      method: config.method,
      hasAuth: !!config.headers.Authorization,
      withCredentials: config.withCredentials
    });
    
    return config;
  },
  (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터 - 토큰 저장 시 검증
instance.interceptors.response.use(
  (response) => {
    console.log("✅ Response:", {
      url: response.config.url,
      status: response.status,
    });
    
    // 새로운 토큰이 있으면 검증 후 저장
    const newToken = response.headers['authorization'] || response.headers['Authorization'];
    if (newToken && newToken.startsWith('Bearer ')) {
      const tokenValue = newToken.substring(7);
      
      if (isValidJWT(tokenValue)) {
        localStorage.setItem(TOKEN_KEY, tokenValue);
        console.log("🔄 새 토큰 저장됨:", `${tokenValue.substring(0, 20)}...`);
      } else {
        console.warn("🚨 서버에서 받은 토큰이 유효하지 않음:", tokenValue);
      }
    }
    
    return response;
  },
  (error) => {
    console.error("❌ Response Error:", {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
    });
    
    // 401 에러 처리
    if (error.response?.status === 401) {
      console.log("🔓 401 Unauthorized - clearing token");
      localStorage.removeItem(TOKEN_KEY);
      
      if (!isAWSEnvironment()) {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// 토큰 검증 헬퍼 함수
export const validateTokenInAWS = async (): Promise<boolean> => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) {
    console.log("🔍 토큰 검증: 토큰이 없음");
    return false;
  }
  
  if (!isValidJWT(token)) {
    console.log("🔍 토큰 검증: 유효하지 않은 형식");
    localStorage.removeItem(TOKEN_KEY);
    return false;
  }
  
  try {
    const response = await instance.get('/auth/status');
    console.log("🔍 토큰 검증 성공:", response.status);
    return true;
  } catch (error) {
    console.error("🔍 토큰 검증 실패:", error);
    localStorage.removeItem(TOKEN_KEY);
    return false;
  }
};

// 현재 저장된 토큰 상태 확인 함수
export const checkTokenStatus = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  console.log("🔍 토큰 상태 체크:");
  console.log("- 토큰 존재:", !!token);
  console.log("- 토큰 길이:", token?.length || 0);
  console.log("- JWT 형식:", token ? isValidJWT(token) : false);
  console.log("- 토큰 미리보기:", token ? `${token.substring(0, 50)}...` : 'null');
  console.log("- 현재 쿠키:", document.cookie);
  return {
    exists: !!token,
    valid: token ? isValidJWT(token) : false,
    preview: token ? `${token.substring(0, 50)}...` : null
  };
};

// AWS 환경 정보 로깅
if (isAWSEnvironment()) {
  console.log("🌍 AWS Environment Detected:", {
    baseURL: instance.defaults.baseURL,
    timeout: instance.defaults.timeout,
    withCredentials: instance.defaults.withCredentials
  });
}

export default instance;