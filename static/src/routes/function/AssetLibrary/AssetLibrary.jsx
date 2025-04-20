// src/pages/WorldViewLibrary.jsx
import { useState } from "react";
import {
  FiGlobe,
  FiPlus,
  FiImage,
  FiBook,
  FiCode,
  FiSearch,
  FiFilter,
  FiTrash2,
  FiEdit2,
  FiChevronRight,
  FiRefreshCw,
} from "react-icons/fi";
import { useAuth } from "../../../api/auth/context";
import toast from "react-hot-toast";
import { worldApi } from "../../../api/world/worldApi";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AssetLibrary = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [userName, setUserName] = useState(user?.userName || "");
  const [pageInfo, setPageInfo] = useState({
    page: 1,
    page_size: 10,
  });
  useEffect(() => {
    setUserName(user?.userName || "");
  }, [user]);

  const { data: worlds } = useQuery({
    queryKey: ["userData", userName],
    queryFn: async () =>
      await worldApi.worldList({
        user_name: userName,
        ...pageInfo,
      }),
    enabled: !!userName,
  });
  if (!isAuthenticated) {
    return <p className="p-6 text-center">请先登录</p>;
  }

  const handleDeleteWorld = (world_name) => {
    // 这里可以调用API删除世界观
    toast.success("世界观已删除");
  };

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        {/* 标题和操作区 */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center">
              <FiGlobe className="mr-2" /> 世界观资源库
            </h1>
            <p className="text-gray-600">
              集中管理所有世界观设定及其关联AI素材，实现跨模块素材智能调用
            </p>
          </div>
        </div>

        {/* 世界观列表 */}
        <div className="space-y-4">
          {worlds?.map((world) => (
            <div
              key={world.world_name}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <div className="flex">
                {/* 内容区 */}
                <div className="flex-1 p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">
                        {world.world_name}
                      </h2>
                    </div>
                    {/* <div className="text-sm text-gray-500">
                      最后更新: {world.lastUpdated}
                    </div> */}
                  </div>

                  {/* 统计标签 */}
                  <div className="flex gap-3 mt-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm">
                      <FiImage className="mr-1" /> {world.stats?.visuals || 0}
                      个图片
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm">
                      <FiCode className="mr-1" /> {world.stats?.quests || 0}
                      个剧情
                    </span>
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex justify-end mt-4 space-x-2">
                    <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded flex items-center">
                      <FiEdit2 className="mr-1" /> 编辑
                    </button>
                    <button
                      onClick={() => handleDeleteWorld(world.world_name)}
                      className="px-3 py-1 text-sm text-red-500 hover:bg-red-50 rounded flex items-center"
                    >
                      <FiTrash2 className="mr-1" /> 删除
                    </button>
                    <button className="px-3 py-1 text-sm bg-amber-500 text-white rounded flex items-center hover:bg-amber-600">
                      进入 <FiChevronRight className="ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AssetLibrary;
