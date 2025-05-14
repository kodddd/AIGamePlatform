import axios from "axios";
import { getToken, clearToken } from "./auth/context";

const client = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "",
});

// 请求拦截器
client.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截器
client.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      if (error.response.status == 401) {
        clearToken();
      }
      // 结构化错误信息
      const apiError = {
        status: error.response.status,
        message: error.response.data?.message || "请求失败",
        errors: error.response.data?.errors || {},
        code: error.response.data?.code,
      };
      return Promise.reject(apiError);
    }
    return Promise.reject(error);
  }
);

export default client;
