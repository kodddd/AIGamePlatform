import { NavLink } from "react-router-dom";
import { FiBook, FiImage, FiArrowLeft } from "react-icons/fi";

const Sidebar = () => {
  return (
    <div className="w-48 h-[calc(100vh-4rem)] bg-gray-800 text-white shadow-lg flex-shrink-0 sticky top-16 z-100">
      <nav className="p-4">
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
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
