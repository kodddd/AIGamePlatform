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

const WorldViewLibrary = () => {
  const { user, isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // 示例数据
  const [worldViews, setWorldViews] = useState([
    {
      id: "w1",
      name: "赛博长安",
      desc: "唐代文化与Cyberpunk的融合世界观",
      coverImg: "/covers/cyber-tang.jpg",
      stats: {
        stories: 8,
        visuals: 15,
        quests: 6,
      },
      lastUpdated: "2023-11-20",
    },
    {
      id: "w2",
      name: "星穹列国",
      desc: "太空歌剧下的战国争霸",
      coverImg: "/covers/space-warring.jpg",
      stats: {
        stories: 12,
        visuals: 9,
        quests: 4,
      },
      lastUpdated: "2023-11-18",
    },
  ]);

  if (!isAuthenticated) {
    return <p className="p-6 text-center">请先登录</p>;
  }

  const handleCreateWorldView = () => {
    setIsCreating(true);
    // 实际创建逻辑
    setTimeout(() => {
      toast.success("新世界观已创建");
      setIsCreating(false);
    }, 1500);
  };

  const handleDeleteWorldView = (id) => {
    setWorldViews(worldViews.filter((w) => w.id !== id));
    setDeleteConfirm(null);
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

          <button
            onClick={handleCreateWorldView}
            disabled={isCreating}
            className={`px-4 py-2 rounded-md font-medium flex items-center ${
              isCreating
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-amber-500 hover:bg-amber-600 text-white shadow-md"
            }`}
          >
            {isCreating ? (
              <>
                <FiRefreshCw className="animate-spin mr-2" />
                创建中...
              </>
            ) : (
              <>
                <FiPlus className="mr-2" />
                新建世界观
              </>
            )}
          </button>
        </div>

        {/* 搜索和筛选栏 */}
        <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-lg shadow">
          <div className="relative flex-1 max-w-md">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="搜索世界观名称或描述..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
            />
          </div>

          <button className="ml-4 px-4 py-2 border border-gray-300 rounded-md flex items-center text-gray-700 hover:bg-gray-50">
            <FiFilter className="mr-2" />
            筛选
          </button>
        </div>

        {/* 世界观列表 */}
        <div className="space-y-4">
          {worldViews.map((world) => (
            <div
              key={world.id}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <div className="flex">
                {/* 封面图 */}
                <div className="w-1/4 min-w-[200px] bg-gray-100 flex items-center justify-center">
                  <img
                    src={world.coverImg}
                    alt={world.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* 内容区 */}
                <div className="flex-1 p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">
                        {world.name}
                      </h2>
                      <p className="text-gray-600 mt-1">{world.desc}</p>
                    </div>
                    <div className="text-sm text-gray-500">
                      最后更新: {world.lastUpdated}
                    </div>
                  </div>

                  {/* 统计标签 */}
                  <div className="flex gap-3 mt-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-sm">
                      <FiBook className="mr-1" /> {world.stats.stories}个故事
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm">
                      <FiImage className="mr-1" /> {world.stats.visuals}个素材
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm">
                      <FiCode className="mr-1" /> {world.stats.quests}个剧情
                    </span>
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex justify-end mt-4 space-x-2">
                    {deleteConfirm === world.id ? (
                      <>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
                        >
                          取消
                        </button>
                        <button
                          onClick={() => handleDeleteWorldView(world.id)}
                          className="px-3 py-1 text-sm bg-red-500 text-white rounded flex items-center"
                        >
                          <FiTrash2 className="mr-1" /> 确认删除
                        </button>
                      </>
                    ) : (
                      <>
                        <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded flex items-center">
                          <FiEdit2 className="mr-1" /> 编辑
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(world.id)}
                          className="px-3 py-1 text-sm text-red-500 hover:bg-red-50 rounded flex items-center"
                        >
                          <FiTrash2 className="mr-1" /> 删除
                        </button>
                        <button className="px-3 py-1 text-sm bg-amber-500 text-white rounded flex items-center hover:bg-amber-600">
                          进入 <FiChevronRight className="ml-1" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 空状态 */}
        {worldViews.length === 0 && (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <FiGlobe className="mx-auto text-4xl text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-700">暂无世界观</h3>
            <p className="text-gray-500 mt-2 mb-4">
              创建你的第一个世界观来开始创作
            </p>
            <button
              onClick={handleCreateWorldView}
              className="px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600"
            >
              <FiPlus className="inline mr-2" />
              新建世界观
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorldViewLibrary;
