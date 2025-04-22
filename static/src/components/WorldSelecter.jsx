// src/pages/WorldViewLibrary.jsx
import { useState } from "react";
import { FiGlobe, FiImage, FiCode, FiChevronRight } from "react-icons/fi";
import { useAuth } from "../api/auth/context";
import { worldApi } from "../api/world/worldApi";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { format } from "date-fns";
import Pagination from "../components/Pagination";

const WorldSelecter = ({ onClose, onSelect }) => {
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [userName, setUserName] = useState(user?.userName || "");
  const [pageInfo, setPageInfo] = useState({
    page: 1,
    page_size: 5,
  });

  useEffect(() => {
    setUserName(user?.userName || "");
  }, [user]);

  const refreshData = () => {
    queryClient.invalidateQueries(["userData", userName, pageInfo]);
  };

  const { data: worldsData } = useQuery({
    queryKey: ["userData", userName, pageInfo],
    queryFn: async () =>
      await worldApi.worldList({
        user_name: userName,
        ...pageInfo,
      }),
    enabled: !!userName,
  });

  const handlePageChange = (newPage) => {
    setPageInfo((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl p-6 max-w-md w-full">
          <p className="text-center">请先登录</p>
          <button
            onClick={onClose}
            className="mt-4 w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded"
          >
            关闭
          </button>
        </div>
      </div>
    );
  }

  const totalPages = worldsData?.total_count
    ? Math.ceil(worldsData.total_count / pageInfo.page_size)
    : 1;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-3xl w-full max-h-[90vh] flex flex-col">
        {/* 标题和关闭按钮 */}
        <div className="p-6 border-b flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center">
              <FiGlobe className="mr-2" /> 选择世界观
            </h1>
            <p className="text-gray-600 mt-1">从您的世界观资源库中选择一个</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        {/* 内容区域 */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* 世界观列表 */}
          <div className="space-y-4">
            {worldsData?.worlds?.map((world) => (
              <div
                key={world.world_name}
                className="bg-white rounded-lg border overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="flex">
                  {/* 内容区 */}
                  <div className="flex-1 p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-lg font-semibold text-gray-800">
                          {world.world_name}
                        </h2>
                      </div>
                      <div className="text-xs text-gray-500">
                        更新:{" "}
                        {format(
                          new Date(world.last_updated * 1000),
                          "yyyy-MM-dd"
                        )}
                      </div>
                    </div>

                    {/* 统计标签 */}
                    <div className="flex gap-2 mt-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-green-100 text-green-800 text-xs">
                        <FiImage className="mr-1" /> {world.stats?.visuals || 0}
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs">
                        <FiCode className="mr-1" /> {world.stats?.quests || 0}
                      </span>
                    </div>

                    {/* 操作按钮 */}
                    <div className="flex justify-end mt-3">
                      <button
                        onClick={() => onSelect(world)}
                        className="px-3 py-1 text-sm bg-blue-500 text-white rounded flex items-center hover:bg-blue-600"
                      >
                        选择 <FiChevronRight className="ml-1" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 分页组件 */}
          {worldsData?.total_count > pageInfo.page_size && (
            <Pagination
              currentPage={pageInfo.page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              className="mt-6"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default WorldSelecter;
