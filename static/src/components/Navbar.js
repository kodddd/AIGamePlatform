import { Link, NavLink } from "react-router-dom";
import { FiFile, FiUser, FiSettings, FiLogIn, FiLogOut } from "react-icons/fi";
import { useAuth } from "../api/auth/context";

const Navbar = ({ showUserMenu = true }) => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="bg-black text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo部分 */}
        <Link
          to="/"
          className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-md" />
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
            AI游戏平台
          </span>
        </Link>

        {/* 导航菜单 */}
        {showUserMenu && (
          <nav className="hidden md:flex space-x-1">
            {isAuthenticated ? (
              <>
                <NavItem to="/docs" icon={<FiFile />} text="文档" />
                <NavItem
                  to="/profile"
                  icon={<FiUser />}
                  text={user?.userName || "个人中心"}
                />
                <button
                  onClick={logout}
                  className="flex items-center px-4 py-2 rounded-md transition-all hover:bg-gray-800 hover:text-gray-200"
                >
                  <FiLogOut className="mr-2" />
                  退出
                </button>
              </>
            ) : (
              <NavItem to="/login" icon={<FiLogIn />} text="登录" />
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

const NavItem = ({ to, icon, text }) => (
  <NavLink
    to={to}
    className={({ isActive }) => `
      flex items-center px-4 py-2 rounded-md transition-all
      ${
        isActive
          ? "bg-gray-800 text-blue-400"
          : "hover:bg-gray-800 hover:text-gray-200"
      }
    `}
  >
    <span className="mr-2">{icon}</span>
    {text}
  </NavLink>
);

export default Navbar;
