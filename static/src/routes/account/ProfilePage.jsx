import React, { useState } from "react";
import { useAuth } from "../../api/auth/context";
import client from "../../api/client";
import toast from "react-hot-toast";
import { userApi } from "../../api/user/userApi";

const Profile = () => {
  const { user: authUser, initializeAuth } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // 使用认证上下文中的用户数据初始化
  const [tempUser, setTempUser] = useState({
    userName: authUser?.userName || "",
    email: authUser?.email || "",
  });

  // 密码相关状态
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // 错误状态
  const [errors, setErrors] = useState({
    userName: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // 邮箱验证正则
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleEdit = () => {
    setTempUser({
      userName: authUser?.userName || "",
      email: authUser?.email || "",
    });
    setIsEditing(true);
    setErrors({
      userName: "",
      email: "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      userName: "",
      email: "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    };

    // 用户名验证
    if (tempUser.userName.length > 15) {
      newErrors.userName = "用户名不能超过15个字符";
      valid = false;
    }

    // 邮箱验证
    if (!validateEmail(tempUser.email)) {
      newErrors.email = "请输入有效的邮箱地址";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const validatePasswordForm = () => {
    let valid = true;
    const newErrors = {
      userName: "",
      email: "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    };

    // 当前密码验证
    if (!passwordData.currentPassword) {
      newErrors.currentPassword = "请输入当前密码";
      valid = false;
    }

    // 新密码验证
    if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = "密码长度至少为6个字符";
      valid = false;
    }

    // 确认密码验证
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = "两次输入的密码不一致";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSave = async () => {
    if (validateForm()) {
      try {
        // 调用更新用户信息的API
        await userApi.update({
          username: tempUser.userName,
          email: tempUser.email,
        });

        initializeAuth();
        toast.success("个人信息更新成功");
        setIsEditing(false);
      } catch (error) {
        toast.error(error.message || "更新失败");
      }
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setIsChangingPassword(false);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setErrors({
      userName: "",
      email: "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTempUser((prev) => ({ ...prev, [name]: value }));

    // 实时验证
    if (name === "userName" && value.length > 15) {
      setErrors((prev) => ({ ...prev, userName: "用户名不能超过15个字符" }));
    } else if (name === "email" && !validateEmail(value)) {
      setErrors((prev) => ({ ...prev, email: "请输入有效的邮箱地址" }));
    } else {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));

    // 实时密码验证
    if (name === "newPassword") {
      if (value.length < 6 && value.length > 0) {
        setErrors((prev) => ({
          ...prev,
          newPassword: "密码长度至少为6个字符",
        }));
      } else {
        setErrors((prev) => ({ ...prev, newPassword: "" }));
      }
    }

    if (name === "confirmPassword" && passwordData.newPassword !== value) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "两次输入的密码不一致",
      }));
    } else if (name === "confirmPassword") {
      setErrors((prev) => ({ ...prev, confirmPassword: "" }));
    }
  };

  const handlePasswordSubmit = async () => {
    if (validatePasswordForm()) {
      try {
        // 调用更改密码API
        await userApi.updatePassword({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        });

        // 重置表单
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setErrors({
          userName: "",
          email: "",
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setIsChangingPassword(false);

        toast.success("密码已成功更改");
      } catch (error) {
        toast.error(error.message || "密码更改失败");
      }
    }
  };

  if (!authUser) {
    return (
      <div className="min-h-screen bg-gray-600 pt-24">
        <div className="max-w-2xl min-h-[512px] mx-auto p-6 bg-gray-800 rounded-xl shadow-2xl text-gray-100 flex items-center justify-center">
          <p>请先登录</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-600 pt-24">
      <div className="max-w-2xl min-h-[512px] mx-auto p-6 bg-gray-800 rounded-xl shadow-2xl text-gray-100">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
            AI 游戏创作平台
          </h1>
          <div className="flex space-x-2">
            {!isEditing && !isChangingPassword ? (
              <>
                <button
                  onClick={handleEdit}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                >
                  编辑资料
                </button>
                <button
                  onClick={() => setIsChangingPassword(true)}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors"
                >
                  更改密码
                </button>
              </>
            ) : (
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
              >
                取消
              </button>
            )}
          </div>
        </div>

        {isChangingPassword ? (
          <div className="space-y-6">
            <h2 className="text-xl font-bold mb-4">更改密码</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  当前密码
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {errors.currentPassword && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.currentPassword}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  新密码 (至少6个字符)
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {errors.newPassword && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.newPassword}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  确认新密码
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {errors.confirmPassword && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <button
                onClick={handlePasswordSubmit}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
              >
                确认更改
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-start space-x-6 mb-16">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-3xl font-bold">
                {authUser.userName?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                {isEditing ? (
                  <>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        用户名 (最多15个字符)
                      </label>
                      <input
                        type="text"
                        name="userName"
                        value={tempUser.userName}
                        onChange={handleChange}
                        maxLength={15}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <div className="flex justify-between">
                        {errors.userName && (
                          <p className="text-red-400 text-sm">
                            {errors.userName}
                          </p>
                        )}
                        <span className="text-gray-400 text-sm">
                          {tempUser.userName.length}/15
                        </span>
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        电子邮箱
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={tempUser.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      {errors.email && (
                        <p className="text-red-400 text-sm mt-1">
                          {errors.email}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors mt-4"
                      disabled={!!errors.userName || !!errors.email}
                    >
                      保存更改
                    </button>
                  </>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold">{authUser.userName}</h2>
                    <p className="text-gray-400 mt-1">{authUser.email}</p>
                  </>
                )}
              </div>
            </div>

            {/* 平台使用统计部分 */}
            <div className="bg-gray-700 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">创作统计</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-800 p-4 rounded-lg">
                  <p className="text-sm text-gray-400">AI生成故事</p>
                  <p className="text-xl font-bold">24</p>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                  <p className="text-sm text-gray-400">任务分支</p>
                  <p className="text-xl font-bold">56</p>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                  <p className="text-sm text-gray-400">2D素材</p>
                  <p className="text-xl font-bold">112</p>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                  <p className="text-sm text-gray-400">3D素材</p>
                  <p className="text-xl font-bold">38</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
