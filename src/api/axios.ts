import axios from "axios";

// baseURL이 비어있으면 기본값 사용 (중요!)
const baseURL = (process.env.REACT_APP_API_BASE_URL ||
  "http://k8s-default-ingress-164f943143-1841556789.ap-northeast-2.elb.amazonaws.com")
  .replace(/\/$/, ""); // 끝 슬래시 제거

console.log("🔧 Axios baseURL:", baseURL);
console.log("🔧 Environment:", process.env.REACT_APP_API_BASE_URL);

const instance = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
  timeout: 15000,
});

export default instance;
