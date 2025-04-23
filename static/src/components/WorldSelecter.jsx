// src/pages/WorldViewLibrary.jsx
import { useState, useEffect } from "react";
import { FiGlobe, FiImage, FiCode } from "react-icons/fi";
import { useAuth } from "../api/auth/context";
import { worldApi } from "../api/world/worldApi";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import Pagination from "../components/Pagination";

const WorldSelecter = ({ onClose, onSelect }) => {
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [userName, setUserName] = useState(user?.userName || "");
  const [pageInfo, setPageInfo] = useState({ page: 1, page_size: 5 });

  useEffect(() => setUserName(user?.userName || ""), [user]);

  const { data: worldsData } = useQuery({
    queryKey: ["userData", userName, pageInfo],
    queryFn: () => worldApi.worldList({ user_name: userName, ...pageInfo }),
    enabled: !!userName,
  });

  if (!isAuthenticated)
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2">
        <div className="bg-white rounded-lg p-4 max-w-xs w-full">
          <p className="text-center text-sm">请先登录</p>
          <button
            onClick={onClose}
            className="mt-2 w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-1 px-3 rounded text-sm"
          >
            关闭
          </button>
        </div>
      </div>
    );

  const totalPages = worldsData?.total_count
    ? Math.ceil(worldsData.total_count / pageInfo.page_size)
    : 1;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2">
      <div className="bg-white rounded-lg shadow-md max-w-md w-full max-h-[90vh] flex flex-col">
        <div className="p-3 border-b flex justify-between items-center">
          <div>
            <h1 className="text-lg font-bold flex items-center gap-1">
              <FiGlobe size={16} /> 选择世界观
            </h1>
            <p className="text-gray-500 text-xs mt-0.5">点击卡片选择世界观</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-lg leading-none"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          <div className="space-y-2">
            {worldsData?.worlds?.map((world) => (
              <div
                key={world.world_name}
                onClick={() => onSelect(world)}
                className="border rounded hover:shadow-sm transition-all cursor-pointer active:scale-[0.98]"
              >
                <div className="p-2">
                  <div className="flex justify-between items-center">
                    <h2 className="font-medium text-sm">{world.world_name}</h2>
                    <span className="text-xs text-gray-400">
                      {format(
                        new Date(world.last_updated * 1000),
                        "yyyy/MM/dd"
                      )}
                    </span>
                  </div>

                  <div className="flex gap-1 mt-1">
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-green-50 text-green-700 text-[11px]">
                      <FiImage size={10} className="mr-0.5" />{" "}
                      {world.stats?.visuals || 0}
                    </span>
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[11px]">
                      <FiCode size={10} className="mr-0.5" />{" "}
                      {world.stats?.quests || 0}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {worldsData?.total_count > pageInfo.page_size && (
            <Pagination
              currentPage={pageInfo.page}
              totalPages={totalPages}
              onPageChange={(p) =>
                setPageInfo((prev) => ({ ...prev, page: p }))
              }
              className="mt-3"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default WorldSelecter;
