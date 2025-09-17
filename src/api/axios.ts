import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL?.replace(/\/$/, "")
                 || "http://k8s-default-ingress-164f943143-1841556789.ap-northeast-2.elb.amazonaws.com/backend";

const instance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});


export default instance;
