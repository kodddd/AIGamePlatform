import { useState } from "react";
import { Link } from "react-router-dom";
import { RiGamepadLine } from "react-icons/ri";

const Login = () => {
  const [loginMethod, setLoginMethod] = useState("email"); // 'email' 或 'username'
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (loginMethod === "email") {
      if (!formData.email) newErrors.email = "邮箱不能为空";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "请输入有效的邮箱地址";
      }
    } else {
      if (!formData.username.trim()) newErrors.username = "用户名不能为空";
    }

    if (!formData.password) newErrors.password = "密码不能为空";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      // 模拟登录请求
      setTimeout(() => {
        alert(`使用${loginMethod === "email" ? "邮箱" : "用户名"}登录成功！`);
        setIsLoading(false);
      }, 1500);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* 登录卡片 */}
        <div className="bg-white rounded-xl shadow-2xl p-8 sm:p-10">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center shadow-lg">
              <RiGamepadLine className="text-white w-12 h-12" />
            </div>
          </div>

          {/* 标题 */}
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
            欢迎回来
          </h2>
          <p className="text-gray-600 text-center mb-8">请选择登录方式</p>

          {/* 登录方式切换 */}
          <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setLoginMethod("email")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${
                loginMethod === "email"
                  ? "bg-white shadow-sm text-indigo-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              邮箱登录
            </button>
            <button
              type="button"
              onClick={() => setLoginMethod("username")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${
                loginMethod === "username"
                  ? "bg-white shadow-sm text-indigo-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              用户名登录
            </button>
          </div>

          {/* 登录表单 */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 动态输入框 */}
            {loginMethod === "email" ? (
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  邮箱地址
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  } focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
                  placeholder="your@email.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
            ) : (
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  用户名
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.username ? "border-red-500" : "border-gray-300"
                  } focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
                  placeholder="输入用户名"
                />
                {errors.username && (
                  <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                )}
              </div>
            )}

            {/* 密码输入 */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  密码
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-indigo-600 hover:text-indigo-500 hover:underline"
                >
                  忘记密码?
                </Link>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* 记住我 & 登录按钮 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-700"
                >
                  记住我
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`px-6 py-3 rounded-lg font-medium text-white ${
                  isLoading
                    ? "bg-indigo-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 shadow-md"
                } transition-colors`}
              >
                {isLoading ? "登录中..." : "立即登录"}
              </button>
            </div>
          </form>

          {/* 注册引导 */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 text-sm">
              还没有账号?{" "}
              <Link
                to="/register"
                className="text-indigo-600 hover:text-indigo-500 font-medium hover:underline"
              >
                立即注册
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
