// src/pages/StoryWorkshop.jsx
import { useState, useRef } from "react";
import {
  FiBook,
  FiDownload,
  FiSettings,
  FiRefreshCw,
  FiList,
  FiUser,
  FiGlobe,
  FiEdit2,
  FiSave,
  FiPlay,
  FiTarget,
  FiZap,
  FiCopy,
} from "react-icons/fi";
import { FaMagic } from "react-icons/fa";
import { storyWorkshopApi } from "../../../api/storyWorkshop/storyWorkshopApi";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import WorldSelecter from "../../../components/WorldSelecter";
import { sleep } from "../../../utils/time";
import { worldApi } from "../../../api/world/worldApi";

const StoryWorkshop = () => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedStory, setGeneratedStory] = useState(null);
  const [settings, setSettings] = useState({
    casualty: 1,
    creativity: 0,
  });
  const navigate = useNavigate();
  const textareaRef = useRef(null);
  const [showWorldSelecter, setShowWorldSelecter] = useState(false);
  const [selectedWorld, setSelectedWorld] = useState(null);
  const [storyTitle, setStoryTitle] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setGeneratedStory(null);
    try {
      const response = await storyWorkshopApi.generateStory({
        prompt: prompt,
        casualty: settings.casualty,
        creativity: settings.creativity,
        background: selectedWorld?.base_text,
      });
      setGeneratedStory({
        content: response.content,
        title: response.title || "未命名剧情",
      });
      setStoryTitle(response.title || "");
    } catch (error) {
      if (error.status == 401) {
        navigate("/login");
        toast.error("登录过期请重新登录");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleWorldSelect = (world) => {
    console.log("Selected world:", world);
    setShowWorldSelecter(false);
    setSelectedWorld(world);
  };

  const handleSaveStory = async () => {
    if (!generatedStory || !storyTitle) return;

    const storyData = {
      world_id: selectedWorld.id,
      title: storyTitle,
      content: generatedStory.content,
      prompt: prompt,
    };

    try {
      const response = await worldApi.addStory(storyData);
      toast.success("剧情保存成功");
      console.log("Story saved:", response);
    } catch (error) {
      if (error.status == 401) {
        navigate("/login");
        toast.error("登录过期请重新登录");
      } else {
        toast.error("保存剧情失败");
      }
      console.error("Error saving story:", error);
    }
  };

  const handleCopyToClipboard = async () => {
    if (!generatedStory) return;

    try {
      await navigator.clipboard.writeText(generatedStory.content);
      toast.success("剧情已复制到剪贴板");
    } catch (error) {
      toast.error("复制失败");
      console.error("复制失败:", error);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-2">
          <FiBook className="text-3xl text-indigo-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-800">AI剧情工坊</h1>
        </div>
        <p className="text-gray-600 mb-5">
          通过文字描述生成动态剧情，支持多种风格和复杂度调节
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">
          {/* 控制面板 */}
          <div className="bg-white rounded-xl shadow-md p-6 lg:col-span-1 flex flex-col">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FiSettings className="mr-2" /> 生成设置
            </h2>

            <div className="space-y-6">
              {/* 世界观选择 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FiGlobe className="mr-1" /> 世界观
                </label>
                <button
                  onClick={() => setShowWorldSelecter(true)}
                  className="w-full px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-md border flex items-center justify-center"
                >
                  <FiGlobe className="mr-2" /> 选择世界观
                </button>
                {selectedWorld && (
                  <div className="mt-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-md text-sm inline-block">
                    {selectedWorld.world_name}
                  </div>
                )}
                {!selectedWorld && (
                  <div className="mt-2 px-3 py-1 text-sm bg-gray-400 rounded-md text-gray-600 inline-block">
                    请选择世界观
                  </div>
                )}
              </div>

              {/* 提示词输入 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FiEdit2 className="mr-1" /> 剧情提示
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="例：精灵公主在寻找失落的神器时遇到了兽人部落的阻挠"
                  className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <FiTarget className="mr-1" />
                  随机性 {settings.casualty.toFixed(1)}
                </label>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={settings.casualty}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      casualty: parseFloat(e.target.value),
                    })
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>集中</span>
                  <span>平衡</span>
                  <span>随机</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <FiZap className="mr-1" />
                  创意度 {settings.creativity.toFixed(1)}
                </label>
                <input
                  type="range"
                  min="-2"
                  max="2"
                  step="0.1"
                  value={settings.creativity}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      creativity: parseFloat(e.target.value),
                    })
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>严谨</span>
                  <span>平衡</span>
                  <span>创意</span>
                </div>
              </div>

              {/* 生成按钮 */}
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim() || !selectedWorld}
                className={`w-full px-4 py-3 rounded-md font-medium text-white ${
                  isGenerating || !prompt.trim() || !selectedWorld
                    ? "bg-indigo-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 shadow-md"
                } flex items-center justify-center`}
              >
                {isGenerating ? (
                  <>
                    <FiRefreshCw className="animate-spin mr-2" />
                    生成中...
                  </>
                ) : (
                  "开始生成"
                )}
              </button>
            </div>
          </div>

          {/* 主展示区 */}
          <div className="lg:col-span-3 flex flex-col">
            {/* 剧情展示区 */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden flex-1 flex flex-col">
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="text-xl font-semibold flex items-center">
                  <FiBook className="mr-2" /> 剧情内容
                </h2>
                <div className="flex space-x-2">
                  {generatedStory && (
                    <input
                      type="text"
                      value={storyTitle}
                      onChange={(e) => setStoryTitle(e.target.value)}
                      placeholder="输入剧情标题"
                      className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mr-2 w-64"
                    />
                  )}
                  {generatedStory && (
                    <button
                      onClick={handleSaveStory}
                      disabled={!storyTitle}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                    >
                      <FiSave className="mr-2" /> 保存剧情
                    </button>
                  )}
                  {generatedStory && (
                    <button
                      onClick={handleCopyToClipboard}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
                    >
                      <FiCopy className="mr-2" /> 复制文本
                    </button>
                  )}
                </div>
              </div>

              <div className="p-6 flex-1 min-h-96 bg-gray-50 overflow-auto">
                {isGenerating ? (
                  <div className="text-center">
                    <FiRefreshCw className="animate-spin text-4xl text-indigo-600 mx-auto mb-4 mt-4" />
                    <p className="text-gray-600">AI正在创作您的剧情...</p>
                    <p className="text-sm text-gray-500 mt-2">
                      根据设置复杂度，可能需要20-60秒
                    </p>
                  </div>
                ) : generatedStory ? (
                  <div className="prose max-w-none">
                    <h2 className="text-2xl font-bold mb-4">{storyTitle}</h2>
                    <div className="whitespace-pre-wrap text-gray-800">
                      {generatedStory.content}
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 h-full flex flex-col justify-center">
                    <FiBook className="text-5xl mx-auto mb-4 opacity-30" />
                    <p>生成的剧情内容将显示在这里</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {showWorldSelecter && (
        <WorldSelecter
          onClose={() => setShowWorldSelecter(false)}
          onSelect={handleWorldSelect}
        />
      )}
    </div>
  );
};

export default StoryWorkshop;
