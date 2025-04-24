// src/pages/VisualWorkshop.jsx
import { useState, useRef } from "react";
import {
  FiImage,
  FiDownload,
  FiSettings,
  FiRefreshCw,
  FiLayers,
  FiUser,
  FiGlobe,
  FiMaximize2,
  FiEdit,
} from "react-icons/fi";
import { FaPalette } from "react-icons/fa";
import { visualWorkshopApi } from "../../../api/visualWorkshop/visualWorkshop";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import WorldSelecter from "../../../components/WorldSelecter";
import { sleep } from "../../../utils/time";
import { worldApi } from "../../../api/world/worldApi";
import WorldDetailsPopup from "../../../components/WorldDetailsPopup";

const VisualWorkshop = () => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [settings, setSettings] = useState({
    style: "动漫风格",
    size: "square", // square, portrait, landscape
  });
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [showWorldSelecter, setShowWorldSelecter] = useState(false);
  const [selectedWorld, setSelectedWorld] = useState(null);
  const [characterName, setCharacterName] = useState("");
  const [showWorldDetails, setShowWorldDetails] = useState(false);
  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setGeneratedImage(null);
    try {
      const response = await visualWorkshopApi.generateImage({
        text: prompt,
        aspectRatio: settings.size,
        style: settings.style,
        background: selectedWorld?.base_text,
      });
      sleep(1000);
      setGeneratedImage({
        url: response.url,
      });
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
  const handleAddCharacter = async () => {
    if (!generatedImage || !characterName) return;

    const characterData = {
      world_id: selectedWorld.id,
      character_name: characterName,
      base_image: generatedImage.url,
      character_description: prompt,
    };

    try {
      const response = await worldApi.addCharacter(characterData);
      toast.success("角色添加成功");
      console.log("Character added:", response);
    } catch (error) {
      if (error.status == 401) {
        navigate("/login");
        toast.error("登录过期请重新登录");
      } else {
        toast.error("添加角色失败");
      }
      console.error("Error adding character:", error);
    }
  };
  const handleDownload = async () => {
    if (!generatedImage) return;
    try {
      const response = await fetch(generatedImage.url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `ai-art-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();

      // 清理
      window.URL.revokeObjectURL(blobUrl);
      document.body.removeChild(link);
    } catch (error) {
      console.error("下载失败:", error);
      alert("图片下载失败，请重试");
    }
  };

  const styles = [
    { value: "动漫风格", label: "动漫风格" },
    { value: "写实风格", label: "写实风格" },
    { value: "像素风格", label: "像素风格" },
    { value: "水彩风格", label: "水彩风格" },
    { value: "赛博朋克", label: "赛博朋克" },
    { value: "奇幻风格", label: "奇幻风格" },
  ];

  const sizes = [
    { value: "square", label: "正方形" },
    { value: "portrait", label: "竖版" },
    { value: "landscape", label: "横版" },
  ];

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-2">
          <FiImage className="text-3xl text-indigo-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-800">AI视觉工坊</h1>
        </div>
        <p className="text-gray-600 mb-5">
          通过文字描述生成角色立绘，支持多种艺术风格调节
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">
          {/* 控制面板 */}
          <div className="bg-white rounded-xl shadow-md p-6 lg:col-span-1 flex flex-col">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FiSettings className="mr-2" /> 生成设置
            </h2>

            <div className="space-y-6">
              {/* 导入角色区域 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FiUser className="mr-1" /> 角色来源
                </label>
                <button
                  onClick={() => setShowWorldSelecter(true)}
                  className="w-full px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-md border flex items-center justify-center"
                >
                  <FiGlobe className="mr-2" /> 从资源库导入世界观
                </button>
                {selectedWorld && (
                  <div
                    className="mt-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-md text-sm inline-block cursor-pointer hover:bg-blue-200 transition-colors"
                    onClick={() => setShowWorldDetails(true)}
                  >
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
                  <FiEdit className="mr-1" /> 角色描述
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="例：精灵女战士，金色长发，绿色铠甲，手持长弓，森林背景"
                  className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* 风格选择 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FaPalette className="mr-1" /> 艺术风格
                </label>
                <select
                  value={settings.style}
                  onChange={(e) =>
                    setSettings({ ...settings, style: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {styles.map((style) => (
                    <option key={style.value} value={style.value}>
                      {style.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* 图片尺寸选择 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FiMaximize2 className="mr-1" />
                  图片尺寸
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size.value}
                      onClick={() =>
                        setSettings({ ...settings, size: size.value })
                      }
                      className={`px-2 py-1 rounded-md text-xs ${
                        settings.size === size.value
                          ? "bg-indigo-100 text-indigo-700 border border-indigo-300"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {size.label}
                    </button>
                  ))}
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
            {/* 预览画布 */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden flex-1 flex flex-col">
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="text-xl font-semibold flex items-center">
                  <FiLayers className="mr-2" /> 生成预览
                </h2>
                {generatedImage && (
                  <input
                    type="text"
                    value={characterName}
                    onChange={(e) => setCharacterName(e.target.value)}
                    placeholder="输入角色名称"
                    className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mr-2 w-64"
                  />
                )}
                {generatedImage && (
                  <button
                    onClick={handleAddCharacter}
                    disabled={!characterName}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-green-700 flex items-center"
                  >
                    <FiUser className="mr-2" /> 添加角色
                  </button>
                )}
                {generatedImage && (
                  <button
                    onClick={handleDownload}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
                  >
                    <FiDownload className="mr-2" /> 下载图片
                  </button>
                )}
              </div>

              <div className="p-6 flex-1 flex justify-center items-center min-h-96 bg-gray-100">
                {isGenerating ? (
                  <div className="text-center">
                    <FiRefreshCw className="animate-spin text-4xl text-indigo-600 mx-auto mb-4" />
                    <p className="text-gray-600">AI正在创作您的角色...</p>
                    <p className="text-sm text-gray-500 mt-2">
                      根据设置复杂度，可能需要10-30秒
                    </p>
                  </div>
                ) : generatedImage ? (
                  <div className="relative group">
                    <img
                      src={generatedImage.url}
                      alt="Generated artwork"
                      className="max-w-full max-h-96 rounded-lg shadow-lg"
                      ref={canvasRef}
                    />
                  </div>
                ) : (
                  <div className="text-center text-gray-500">
                    <FiImage className="text-5xl mx-auto mb-4 opacity-30" />
                    <p>生成的角色立绘将显示在这里</p>
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
      {showWorldDetails && (
        <WorldDetailsPopup
          world={selectedWorld}
          onClose={() => setShowWorldDetails(false)}
        />
      )}
    </div>
  );
};

export default VisualWorkshop;
