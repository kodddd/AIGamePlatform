import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const Layout = ({ showUserMenu = true }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar showUserMenu={showUserMenu} />
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
