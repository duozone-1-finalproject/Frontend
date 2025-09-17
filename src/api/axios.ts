import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL?.replace(/\/$/, "")
                 || "http://k8s-default-ingress-164f943143-1841556789.ap-northeast-2.elb.amazonaws.com/backend";

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://k8s-default-ingress-164f943143-1841556789.ap-northeast-2.elb.amazonaws.com/backend",
  headers: { 
    "Content-Type": "application/json",
    "Accept": "application/json" // JSON 응답 요청
  },
  withCredentials: true,
  timeout: isAWSEnvironment() ? 30000 : 10000,
});

// 요청 인터셉터 - 토큰 검증 로직 추가
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    
    // 토큰이 있고 유효한 경우에만 헤더에 추가
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
    
    // 모든 요청에 JSON 헤더 확실히 설정
    config.headers['Accept'] = 'application/json';
    config.headers['Content-Type'] = 'application/json';
    
    // AWS ELB를 위한 추가 헤더
    if (isAWSEnvironment()) {
      config.headers['X-Requested-With'] = 'XMLHttpRequest';
    }
    
    // 디버깅 정보
    console.log("🚀 Request Config:", {
      url: config.url,
      method: config.method,
      hasAuth: !!config.headers.Authorization,
      withCredentials: config.withCredentials,
      accept: config.headers.Accept,
      contentType: config.headers['Content-Type']
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
      contentType: response.headers['content-type'],
      dataType: typeof response.data
    });
    
    // HTML 응답이 오는 경우 경고
    if (typeof response.data === 'string' && response.data.includes('<html>')) {
      console.warn("🚨 HTML 응답 받음 - 예상: JSON", response.data.substring(0, 100));
    }
    
    // 로그인 응답에서 토큰 추출
    if (response.config.url?.includes('/auth/login') && response.data?.accessToken) {
      const token = response.data.accessToken;
      if (isValidJWT(token)) {
        localStorage.setItem(TOKEN_KEY, token);
        console.log("🔄 로그인 토큰 저장됨:", `${token.substring(0, 20)}...`);
      } else {
        console.warn("🚨 로그인에서 받은 토큰이 유효하지 않음:", token);
      }
    }
    
    // 응답 헤더에서 새로운 토큰 확인
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
      statusText: error.response?.statusText,
      message: error.message,
      responseData: error.response?.data
    });
    
    // 401 에러 처리
    if (error.response?.status === 401) {
      console.log("🔓 401 Unauthorized - clearing token");
      localStorage.removeItem(TOKEN_KEY);
      
      // AWS 환경에서는 자동 리다이렉트 안함
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
