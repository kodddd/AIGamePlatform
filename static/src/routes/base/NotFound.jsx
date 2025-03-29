// src/pages/NotFound.jsx
import { Link } from "react-router-dom";
import { FiHome, FiFrown } from "react-icons/fi";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col items-center justify-center p-6 text-center">
      {/* 404图形 */}
      <div className="relative mb-8">
        {/* 背景装饰圆环 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-64 h-64 rounded-full border-8 border-dashed border-blue-200 animate-spin-slow"></div>
        </div>

        {/* 中央数字 */}
        <div className="relative z-10">
          <div className="text-9xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            4<FiFrown className="inline mx-2 w-16 h-16 text-purple-500" />4
          </div>
        </div>
      </div>

      {/* 返回主页按钮 */}
      <Link
        to="/"
        className="group relative overflow-hidden px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
      >
        {/* 按钮光效 */}
        <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>

        {/* 按钮内容 */}
        <div className="relative flex items-center justify-center space-x-2">
          <FiHome className="text-white text-xl" />
          <span className="text-white font-medium text-lg">返回首页</span>
        </div>
      </Link>

      {/* 装饰元素 */}
      <div className="mt-16 opacity-30">
        <div className="flex space-x-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-400 to-purple-400"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotFound;
