import Layout from "./Layout";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const FunctionLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 顶部导航栏 - 直接内联 */}
      <header className="bg-black text-white shadow-lg sticky top-0 z-50">
        <Navbar />
      </header>

      {/* 主体内容区 */}
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 overflow-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default FunctionLayout;
