// src/pages/VisualWorkshop.jsx
import { useState, useRef } from "react";
import {
  FiImage,
  FiDownload,
  FiSettings,
  FiRefreshCw,
  FiLayers,
  FiGrid,
  FiSliders,
  FiUser,
  FiX,
} from "react-icons/fi";
import { FaPalette, FaCube, FaBorderStyle } from "react-icons/fa";

// 模拟知识库数据
const mockKnowledgeBase = [
  {
    id: 1,
    name: "艾琳娜",
    description:
      "精灵女战士，金色长发，绿色铠甲，擅长使用长弓。拥有神秘血统的年轻法师，背负着复兴家族的使命。",
    attributes: {
      race: "精灵",
      class: "游侠/法师",
      personality: "坚毅但内心孤独",
      motivation: "寻找失落的圣物",
    },
  },
  {
    id: 2,
    name: "雷克斯",
    description:
      "经验丰富的老战士，银色盔甲，手持巨剑。知晓古老传说，正在培养新一代守护者。",
    attributes: {
      race: "人类",
      class: "战士",
      personality: "严厉但富有智慧",
      motivation: "传承守护者的知识",
    },
  },
  {
    id: 3,
    name: "塞伦",
    description:
      "堕落的精灵王子，紫黑色皮肤，红色眼睛。企图利用黑暗魔法重塑世界，报复将他放逐的精灵王国。",
    attributes: {
      race: "黑暗精灵",
      class: "暗影法师",
      personality: "狡猾而残忍",
      motivation: "复仇与权力",
    },
  },
];

const VisualWorkshop = () => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [settings, setSettings] = useState({
    modelType: "2D", // 2D or 3D
    style: "anime", // anime, realistic, pixel, watercolor
    resolution: "1024x1024",
    detailLevel: 7, // 1-10
    colorPalette: "vibrant", // vibrant, pastel, monochrome, dark
    pose: "default", // default, dynamic, relaxed, action
    lighting: "studio", // studio, natural, dramatic, rim
    border: "none", // none, simple, ornate, comic
  });

  const [showKnowledgeBase, setShowKnowledgeBase] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCharacters = mockKnowledgeBase.filter(
    (char) =>
      char.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      char.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 导入角色处理
  const handleImportCharacter = (character) => {
    setSelectedCharacter(character);
    setPrompt(`角色名称:${character.name}, 外貌描述:${character.description}`);
    setShowKnowledgeBase(false);
    setSearchTerm("");
  };

  // 清除导入的角色
  const handleClearImportedCharacter = () => {
    setSelectedCharacter(null);
    setPrompt("");
  };

  const canvasRef = useRef(null);

  const handleGenerate = () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setGeneratedImages([]);
    setSelectedImage(null);

    // 模拟AI生成图片
    setTimeout(() => {
      const mockImages = Array.from({ length: 4 }, (_, i) => ({
        id: Date.now() + i,
        url: `https://source.unsplash.com/random/600x600/?${settings.modelType === "2D" ? "illustration" : "3d-model"},${settings.style},${prompt.split(" ").join(",")}&sig=${Math.random()}`,
        prompt,
        settings: { ...settings },
      }));

      setGeneratedImages(mockImages);
      setSelectedImage(mockImages[0]);
      setIsGenerating(false);
    }, 3000);
  };

  const handleDownload = () => {
    if (!selectedImage) return;
    // 实际应用中这里应该调用下载API
    const link = document.createElement("a");
    link.href = selectedImage.url;
    link.download = `ai-art-${Date.now()}.jpg`;
    link.click();
  };

  const handleApplyVariation = (variationType) => {
    if (!selectedImage) return;

    setIsGenerating(true);

    // 模拟生成变体
    setTimeout(() => {
      const newImage = {
        id: Date.now(),
        url: `https://source.unsplash.com/random/600x600/?${settings.modelType === "2D" ? "illustration" : "3d-model"},${settings.style},${prompt.split(" ").join(",")},${variationType}&sig=${Math.random()}`,
        prompt: `${prompt} (${variationType} variant)`,
        settings: { ...settings },
      };

      setGeneratedImages([...generatedImages, newImage]);
      setSelectedImage(newImage);
      setIsGenerating(false);
    }, 2000);
  };

  const modelTypes = [
    { value: "2D", label: "2D立绘", icon: <FiImage /> },
    { value: "3D", label: "3D模型", icon: <FaCube /> },
  ];

  const styles = [
    { value: "anime", label: "动漫风格" },
    { value: "realistic", label: "写实风格" },
    { value: "pixel", label: "像素风格" },
    { value: "watercolor", label: "水彩风格" },
    { value: "cyberpunk", label: "赛博朋克" },
    { value: "fantasy", label: "奇幻风格" },
  ];

  const colorPalettes = [
    { value: "vibrant", label: "鲜艳" },
    { value: "pastel", label: "柔和" },
    { value: "monochrome", label: "单色" },
    { value: "dark", label: "暗黑" },
    { value: "warm", label: "暖色调" },
    { value: "cool", label: "冷色调" },
  ];

  const poses = [
    { value: "default", label: "标准姿势" },
    { value: "dynamic", label: "动态姿势" },
    { value: "relaxed", label: "放松姿势" },
    { value: "action", label: "战斗姿势" },
    { value: "sitting", label: "坐姿" },
    { value: "flying", label: "飞行姿势" },
  ];

  const variations = [
    { type: "pose", label: "不同姿势" },
    { type: "color", label: "不同配色" },
    { type: "style", label: "不同风格" },
    { type: "lighting", label: "不同光照" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      {/* 知识库角色选择弹窗 */}
      {showKnowledgeBase && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold flex items-center">
                <FiUser className="mr-2" /> 从知识库选择角色
              </h2>
              <button
                onClick={() => {
                  setShowKnowledgeBase(false);
                  setSearchTerm("");
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX size={24} />
              </button>
            </div>

            <div className="p-4 border-b">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="搜索角色名称或描述..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="flex-1 overflow-y-auto">
              {filteredCharacters.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 p-4">
                  {filteredCharacters.map((character) => (
                    <div
                      key={character.id}
                      onClick={() => handleImportCharacter(character)}
                      className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <h3 className="font-bold text-lg">{character.name}</h3>
                      <p className="text-gray-600 mt-1">
                        {character.description}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          种族: {character.attributes.race}
                        </span>
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                          职业: {character.attributes.class}
                        </span>
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                          性格: {character.attributes.personality}
                        </span>
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                          动机: {character.attributes.motivation}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  没有找到匹配的角色
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-6">
          <FiImage className="text-3xl text-indigo-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-800">AI视觉工坊</h1>
        </div>
        <p className="text-gray-600 mb-8">
          通过文字描述生成2D/3D角色立绘，支持多种艺术风格调节
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 控制面板 */}
          <div className="bg-white rounded-xl shadow-md p-6 lg:col-span-1">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FiSettings className="mr-2" /> 生成设置
            </h2>

            <div className="space-y-6">
              {/* 导入角色区域 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  角色来源
                </label>
                {selectedCharacter ? (
                  <div className="border rounded-lg p-3 bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">
                          {selectedCharacter.name}
                        </h4>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {selectedCharacter.description}
                        </p>
                      </div>
                      <button
                        onClick={handleClearImportedCharacter}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <FiX />
                      </button>
                    </div>
                    <button
                      onClick={() => setShowKnowledgeBase(true)}
                      className="mt-2 w-full text-sm text-indigo-600 hover:text-indigo-800"
                    >
                      重新选择角色
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowKnowledgeBase(true)}
                    className="w-full px-4 py-2 bg-indigo-50 text-indigo-700 rounded-md border border-indigo-100 hover:bg-indigo-100 flex items-center justify-center"
                  >
                    <FiUser className="mr-2" /> 从知识库导入角色
                  </button>
                )}
              </div>
            </div>
            <div className="space-y-6">
              {/* 模型类型选择 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  模型类型
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {modelTypes.map((type) => (
                    <button
                      key={type.value}
                      onClick={() =>
                        setSettings({ ...settings, modelType: type.value })
                      }
                      className={`px-3 py-2 rounded-md flex flex-col items-center ${
                        settings.modelType === type.value
                          ? "bg-indigo-100 text-indigo-700 border border-indigo-300"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      <span className="text-lg mb-1">{type.icon}</span>
                      <span className="text-xs">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 提示词输入 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  角色描述
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

              {/* 细节调节 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FiSliders className="mr-1" /> 细节程度:{" "}
                  {settings.detailLevel}
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={settings.detailLevel}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      detailLevel: parseInt(e.target.value),
                    })
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>简洁</span>
                  <span>适中</span>
                  <span>精细</span>
                </div>
              </div>

              {/* 配色方案 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  配色方案
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {colorPalettes.map((palette) => (
                    <button
                      key={palette.value}
                      onClick={() =>
                        setSettings({
                          ...settings,
                          colorPalette: palette.value,
                        })
                      }
                      className={`px-2 py-1 rounded-md text-xs ${
                        settings.colorPalette === palette.value
                          ? "bg-indigo-100 text-indigo-700 border border-indigo-300"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {palette.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 姿势选择 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  角色姿势
                </label>
                <select
                  value={settings.pose}
                  onChange={(e) =>
                    setSettings({ ...settings, pose: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {poses.map((pose) => (
                    <option key={pose.value} value={pose.value}>
                      {pose.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* 生成按钮 */}
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className={`w-full px-4 py-3 rounded-md font-medium text-white ${
                  isGenerating || !prompt.trim()
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
          <div className="lg:col-span-3 space-y-6">
            {/* 预览画布 */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="text-xl font-semibold flex items-center">
                  <FiLayers className="mr-2" /> 生成预览
                </h2>
                {selectedImage && (
                  <button
                    onClick={handleDownload}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
                  >
                    <FiDownload className="mr-2" /> 下载图片
                  </button>
                )}
              </div>

              <div className="p-6 flex justify-center items-center min-h-96 bg-gray-100">
                {isGenerating ? (
                  <div className="text-center">
                    <FiRefreshCw className="animate-spin text-4xl text-indigo-600 mx-auto mb-4" />
                    <p className="text-gray-600">AI正在创作您的角色...</p>
                    <p className="text-sm text-gray-500 mt-2">
                      根据设置复杂度，可能需要10-30秒
                    </p>
                  </div>
                ) : selectedImage ? (
                  <div className="relative group">
                    <img
                      src={selectedImage.url}
                      alt="Generated artwork"
                      className="max-w-full max-h-96 rounded-lg shadow-lg"
                      ref={canvasRef}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <div className="text-white text-center p-4">
                        <p className="font-medium mb-2">
                          {selectedImage.prompt}
                        </p>
                        <p className="text-sm opacity-80">
                          {settings.modelType === "2D" ? "2D立绘" : "3D模型"} |{" "}
                          {
                            styles.find((s) => s.value === settings.style)
                              ?.label
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500">
                    <FiImage className="text-5xl mx-auto mb-4 opacity-30" />
                    <p>生成的角色立绘将显示在这里</p>
                  </div>
                )}
              </div>
            </div>

            {/* 生成结果网格 */}
            {generatedImages.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <FiGrid className="mr-2" /> 生成结果
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {generatedImages.map((img) => (
                    <div
                      key={img.id}
                      onClick={() => setSelectedImage(img)}
                      className={`cursor-pointer border-2 rounded-lg overflow-hidden transition-all ${
                        selectedImage?.id === img.id
                          ? "border-indigo-500 shadow-md"
                          : "border-transparent hover:border-gray-300"
                      }`}
                    >
                      <img
                        src={img.url}
                        alt="Generated variation"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 变体生成 */}
            {selectedImage && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <FiRefreshCw className="mr-2" /> 生成变体
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {variations.map((variation) => (
                    <button
                      key={variation.type}
                      onClick={() => handleApplyVariation(variation.type)}
                      disabled={isGenerating}
                      className={`px-4 py-2 rounded-md border flex items-center justify-center ${
                        isGenerating
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white text-indigo-600 hover:bg-indigo-50 border-indigo-200"
                      }`}
                    >
                      {variation.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualWorkshop;
