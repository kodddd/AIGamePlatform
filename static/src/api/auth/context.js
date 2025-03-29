// src/api/auth/context.js
import { createContext, useContext, useState, useEffect } from "react";
import client from "../client";
import toast from "react-hot-toast";

// 创建上下文
const AuthContext = createContext();

// Token 相关工具函数
const storeToken = (token) => localStorage.setItem("auth_token", token);
const clearToken = () => localStorage.removeItem("auth_token");
const getToken = () => localStorage.getItem("auth_token");

// 认证API方法
const authApi = {
  login: async (credentials) => {
    const { token, ...user } = await client.post("/auth/login", credentials);
    storeToken(token);
    return user;
  },
  register: async (userData) => {
    const { token, ...user } = await client.post("/auth/register", userData);
    storeToken(token);
    return user;
  },
  logout: async () => {
    // await client.post("/auth/logout");
    clearToken();
  },
  getMe: () => client.get("/auth/me"),
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    if (getToken()) {
      try {
        const userData = await authApi.getMe();
        setUser(userData);
      } catch (error) {
        clearToken();
      }
    }
    setIsLoading(false);
  };

  const login = async (credentials) => {
    const user = await authApi.login(credentials);
    setUser(user);
    return user;
  };

  const register = async (userData) => {
    const user = await authApi.register(userData);
    setUser(user);
    return user;
  };

  const logout = async () => {
    await authApi.logout();
    toast.success("已成功登出");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        register,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth必须在AuthProvider内使用");
  }
  return context;
};

// 导出工具函数（按需）
export { storeToken, clearToken, getToken };
