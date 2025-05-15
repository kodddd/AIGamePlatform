import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuth } from "./api/auth/context";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import Login from "./routes/account/LoginPage";
import Home from "./routes/base/HomePage";
import NotFound from "./routes/base/NotFound";
import Register from "./routes/account/RegisterPage";
import Profile from "./routes/account/ProfilePage";
import Document from "./routes/base/Document";
import WorldExpander from "./routes/function/WorldExpander/WorldExpander";
import VisualWorkshop from "./routes/function/VisualWorkshop/VisualWorkshop";

import Layout from "./components/Layout";
import FunctionLayout from "./components/FunctionLayout";
import AssetLibrary from "./routes/function/AssetLibrary/AssetLibrary";
import StoryWorkshop from "./routes/function/StoryWorkshop/StoryWorkshop";
import WorldDetailView from "./routes/function/AssetLibrary/WorldDetailView";

/**
 * 认证保护路由
 * 用于保护需要登录才能访问的路由
 */
function ProtectedRoute() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet context={{ user }} />;
}

/**
 * 访客路由
 * 仅未登录用户可访问（如登录/注册页）
 */
function GuestRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

function AppRouter() {
  return (
    <Router>
      <Routes>
        {/* 公共路由 - 不需要认证 */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/document" element={<Document />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* 仅访客可访问的路由 */}
        <Route element={<GuestRoute />}>
          <Route element={<Layout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
        </Route>

        {/* 需要认证的功能路由 */}
        <Route element={<ProtectedRoute />}>
          <Route element={<FunctionLayout />}>
            <Route path="/story-expander" element={<WorldExpander />} />
            <Route path="/visual-workshop" element={<VisualWorkshop />} />
            <Route path="/asset-library" element={<AssetLibrary />} />
            <Route path="/story-workshop" element={<StoryWorkshop />} />
            <Route
              path="/asset-library/:worldId"
              element={<WorldDetailView />}
            />
            {/* <Route path="/settings" element={<Settings />} /> */}
          </Route>
          <Route element={<Layout />}>
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default AppRouter;
