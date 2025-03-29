import { NavLink, useNavigate } from "react-router-dom";
import {
  FiBook,
  FiImage,
  FiArrowLeft,
  FiUser,
  FiSettings,
} from "react-icons/fi";

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="w-48 h-[calc(100vh-4rem)] bg-gray-800 text-white shadow-lg flex-shrink-0 sticky top-16 z-40">
      <nav className="p-4">
        {/* 返回按钮 */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center w-full p-3 mb-4 rounded-lg hover:bg-gray-700 text-gray-300 transition-colors"
        >
          <FiArrowLeft className="mr-3" />
          返回
        </button>

        <ul className="space-y-2">
          <li>
            <NavLink
              to="/story-expander"
              className={({ isActive }) =>
                `flex items-center p-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-blue-900 text-white"
                    : "hover:bg-gray-700 text-gray-300"
                }`
              }
            >
              <FiBook className="mr-3" />
              故事扩写引擎
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/visual-workshop"
              className={({ isActive }) =>
                `flex items-center p-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-blue-900 text-white"
                    : "hover:bg-gray-700 text-gray-300"
                }`
              }
            >
              <FiImage className="mr-3" />
              AI视觉工坊
            </NavLink>
          </li>
          {/* <li className="border-t border-gray-700 pt-2 mt-4">
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `flex items-center p-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-blue-900 text-white"
                    : "hover:bg-gray-700 text-gray-300"
                }`
              }
            >
              <FiUser className="mr-3" />
              个人中心
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `flex items-center p-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-blue-900 text-white"
                    : "hover:bg-gray-700 text-gray-300"
                }`
              }
            >
              <FiSettings className="mr-3" />
              设置
            </NavLink>
          </li> */}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
