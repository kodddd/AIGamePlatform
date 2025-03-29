import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const FunctionLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar showUserMenu={true} />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 overflow-auto p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default FunctionLayout;
