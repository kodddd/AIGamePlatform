// src/pages/StoryExpander.jsx
import { useState } from "react";
import {
  FiBook,
  FiUser,
  FiMessageSquare,
  FiSettings,
  FiCopy,
  FiRefreshCw,
  FiSave,
  FiEdit,
} from "react-icons/fi";
import { useAuth } from "../../../api/auth/context";

const StoryExpander = () => {
  const [inputText, setInputText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [output, setOutput] = useState({
    background: "",
    characters: [],
    dialogues: [],
  });
  const [interactionMode, setInteractionMode] = useState(null);
  const [interactionInput, setInteractionInput] = useState("");
  const [settings, setSettings] = useState({
    creativity: 0.7,
    detailLevel: "medium",
    genre: "fantasy",
  });
  const [activeTab, setActiveTab] = useState("background"); // 新增：当前激活的继续对话tab
  const [continuationPrompt, setContinuationPrompt] = useState("");
  const { user, isAuthenticated, logout } = useAuth();
  if (!isAuthenticated) {
    return <p>请先登录</p>;
  }
  const handleGenerate = () => {
    if (!inputText.trim()) return;

    setIsGenerating(true);
    setOutput({
      background: "",
      characters: [],
      dialogues: [],
    });

    // 模拟API调用
    setTimeout(() => {
      const mockResponse = {
        background: `在${inputText}的世界中，${
          settings.genre === "fantasy"
            ? "魔法能量充盈着每个角落，古老的预言正在应验"
            : "科技与人性交织，暗流涌动的赛博都市"
        }。${detailText[settings.detailLevel]}`,
        characters: [
          {
            name: settings.genre === "fantasy" ? "艾琳娜" : "凯特",
            role: "主角",
            description:
              settings.genre === "fantasy"
                ? "拥有神秘血统的年轻法师，背负着复兴家族的使命"
                : "顶尖黑客，偶然发现了改变世界的秘密",
            motivation:
              settings.genre === "fantasy" ? "寻找失落的圣物" : "揭露公司阴谋",
          },
          {
            name: settings.genre === "fantasy" ? "雷克斯" : "维克多",
            role: "导师/盟友",
            description:
              settings.genre === "fantasy"
                ? "经验丰富的老战士，知晓古老传说"
                : "前公司安全主管，掌握关键信息",
            motivation:
              settings.genre === "fantasy"
                ? "培养新一代守护者"
                : "赎清自己的罪孽",
          },
        ],
        dialogues: [
          {
            scene: "初次相遇",
            lines: [
              {
                speaker: settings.genre === "fantasy" ? "艾琳娜" : "凯特",
                text:
                  settings.genre === "fantasy"
                    ? "这些符文...它们在我梦中出现过！这意味着什么？"
                    : "这数据包被加密了11层...他们到底在隐藏什么？",
              },
              {
                speaker: settings.genre === "fantasy" ? "雷克斯" : "维克多",
                text:
                  settings.genre === "fantasy"
                    ? "孩子，你看到的不是梦境，而是血脉记忆。时候到了。"
                    : "别碰那个文件！除非你想和他们一样消失...",
              },
            ],
          },
        ],
      };
      setOutput(mockResponse);
      setIsGenerating(false);
    }, 2000);
  };

  const handleSaveToKnowledgeBase = () => {
    if (!output.background || isSaving) return;

    setIsSaving(true);
    setSaveSuccess(false);

    // 模拟保存到知识库的API调用
    setTimeout(() => {
      console.log("Saved to knowledge base:", output);
      setIsSaving(false);
      setSaveSuccess(true);

      // 3秒后隐藏成功提示
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    }, 1500);
  };
  const startInteraction = (mode) => {
    setInteractionMode(mode);
    setInteractionInput("");
  };
  const cancelInteraction = () => {
    setInteractionMode(null);
    setInteractionInput("");
  };
  const handleContinueGeneration = (type, customPrompt) => {
    const prompt = customPrompt || interactionInput;
    if ((!prompt || !prompt.trim()) && type !== "dialogues") return;

    setIsGenerating(true);
    setActiveTab(type);

    // 模拟API调用
    setTimeout(() => {
      const newContent = generateContinuation(type, prompt);
      setOutput((prev) => ({
        ...prev,
        [type]:
          type === "characters" || type === "dialogues"
            ? [...prev[type], ...newContent]
            : prev[type] + "\n\n" + newContent,
      }));
      setInteractionMode(null);
      setInteractionInput("");
      setIsGenerating(false);
    }, 2000);
  };
  // 世界观交互面板
  const WorldviewInteractionPanel = () => (
    <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <h3 className="font-medium mb-3 flex items-center">
        <FiEdit className="mr-2" /> 扩写世界观
      </h3>
      <textarea
        value={interactionInput}
        onChange={(e) => setInteractionInput(e.target.value)}
        placeholder="输入你想扩展的内容方向（例如：请详细描述这个世界的魔法体系）"
        className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md mb-3"
      />
      <div className="flex justify-end space-x-2">
        <button
          onClick={cancelInteraction}
          className="px-4 py-2 border border-gray-300 rounded-md"
        >
          取消
        </button>
        <button
          onClick={() => handleContinueGeneration("background")}
          disabled={!interactionInput.trim() || isGenerating}
          className={`px-4 py-2 rounded-md text-white ${
            !interactionInput.trim() || isGenerating
              ? "bg-indigo-300 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {isGenerating ? "生成中..." : "提交扩写"}
        </button>
      </div>
    </div>
  );
  // 角色交互面板
  const CharacterInteractionPanel = () => (
    <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <h3 className="font-medium mb-3 flex items-center">
        <FiEdit className="mr-2" /> 新增角色
      </h3>
      <textarea
        value={interactionInput}
        onChange={(e) => setInteractionInput(e.target.value)}
        placeholder="描述你想创建的角色（例如：需要一个神秘的女巫角色，掌握古老的草药知识）"
        className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md mb-3"
      />
      <div className="flex justify-end space-x-2">
        <button
          onClick={cancelInteraction}
          className="px-4 py-2 border border-gray-300 rounded-md"
        >
          取消
        </button>
        <button
          onClick={() => handleContinueGeneration("characters")}
          disabled={!interactionInput.trim() || isGenerating}
          className={`px-4 py-2 rounded-md text-white ${
            !interactionInput.trim() || isGenerating
              ? "bg-indigo-300 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {isGenerating ? "生成中..." : "创建角色"}
        </button>
      </div>
    </div>
  );

  const generateContinuation = (type, prompt) => {
    const genre = settings.genre;
    const basePrompt = prompt || "请继续扩展这部分内容";

    switch (type) {
      case "background":
        return `根据开发者的要求"${basePrompt}"，故事世界进一步展开：${
          genre === "fantasy"
            ? "古老的预言揭示了新的危机，传说中的神器开始显现踪迹。"
            : "公司内部的权力斗争逐渐浮出水面，新的势力加入了这场博弈。"
        }`;

      case "characters":
        return [
          {
            name: genre === "fantasy" ? "塞伦" : "诺亚",
            role: genre === "fantasy" ? "反派" : "中立者",
            description:
              genre === "fantasy"
                ? "堕落的精灵王子，企图利用黑暗魔法重塑世界"
                : "情报贩子，游走于各方势力之间",
            motivation:
              genre === "fantasy"
                ? "报复将他放逐的精灵王国"
                : "在混乱中谋取最大利益",
          },
        ];
      case "dialogues":
        return [
          {
            scene: genre === "fantasy" ? "命运的对峙" : "危险的交易",
            lines: [
              {
                speaker: genre === "fantasy" ? "艾琳娜" : "凯特",
                text:
                  genre === "fantasy"
                    ? "我不会让你毁掉这片土地！"
                    : "这次交易的内容让我很不安...",
              },
              {
                speaker: genre === "fantasy" ? "塞伦" : "诺亚",
                text:
                  genre === "fantasy"
                    ? "太晚了，小法师。毁灭的种子早已播下！"
                    : "在这个城市，不安才是常态，亲爱的。",
              },
            ],
          },
        ];

      default:
        return "";
    }
  };

  const detailText = {
    low: "这是一个充满可能性的世界。",
    medium: "各大势力明争暗斗，主角将在此展开冒险。",
    high: "详细的地理特征、政治结构和历史事件构成了这个世界的复杂肌理。",
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center">
              <FiBook className="mr-2" /> 故事扩写引擎
            </h1>
            <p className="text-gray-600 mb-8">
              输入简要世界观，AI将自动生成完整的游戏叙事素材
            </p>
          </div>
          {/* 顶部操作按钮 */}
          <div className="flex">
            <button
              onClick={handleSaveToKnowledgeBase}
              disabled={!output.background || isSaving}
              className={`px-4 py-2 rounded-md font-medium flex items-center ${
                !output.background || isSaving
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 text-white shadow-md"
              }`}
            >
              {isSaving ? (
                <>
                  <FiRefreshCw className="animate-spin mr-2" />
                  保存中...
                </>
              ) : (
                <>
                  <FiSave className="mr-2" />
                  保存到知识库
                </>
              )}
            </button>
            {saveSuccess && (
              <div className="ml-4 px-4 py-2 bg-green-100 text-green-800 rounded-md flex items-center">
                保存成功！
              </div>
            )}
          </div>
        </div>

        {/* 控制面板 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 输入区 */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FiSettings className="mr-2" /> 生成设置
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  世界类型
                </label>
                <select
                  value={settings.genre}
                  onChange={(e) =>
                    setSettings({ ...settings, genre: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="fantasy">奇幻</option>
                  <option value="scifi">科幻</option>
                  <option value="modern">现代</option>
                  <option value="horror">恐怖</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  细节程度
                </label>
                <div className="flex space-x-2">
                  {["low", "medium", "high"].map((level) => (
                    <button
                      key={level}
                      onClick={() =>
                        setSettings({ ...settings, detailLevel: level })
                      }
                      className={`px-3 py-1 rounded-md text-sm ${
                        settings.detailLevel === level
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {level === "low"
                        ? "简洁"
                        : level === "medium"
                          ? "中等"
                          : "详细"}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  创意度 {settings.creativity.toFixed(1)}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
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
            </div>

            <h2 className="text-xl font-semibold mt-6 mb-4">世界观输入</h2>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="例：一个被遗忘的古代文明沉没在海底，其科技远超现代..."
              className="w-full h-40 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !inputText.trim()}
              className={`mt-4 w-full px-4 py-3 rounded-md font-medium text-white ${
                isGenerating || !inputText.trim()
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

          {/* 输出区 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 背景故事区域 */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="flex justify-between items-center p-6 border-b">
                <h2 className="text-xl font-semibold flex items-center">
                  <FiBook className="mr-2" /> 背景故事
                </h2>
                {output.background && (
                  <button
                    onClick={() => copyToClipboard(output.background)}
                    className="text-indigo-600 hover:text-indigo-800 flex items-center text-sm"
                  >
                    <FiCopy className="mr-1" /> 复制
                  </button>
                )}
              </div>

              <div className="p-6">
                <p className="text-gray-700 whitespace-pre-line mb-4">
                  {output.background || "生成结果将显示在这里..."}
                </p>

                {interactionMode === "background" ? (
                  <WorldviewInteractionPanel />
                ) : (
                  output.background && (
                    <button
                      onClick={() => startInteraction("background")}
                      className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center"
                    >
                      <FiEdit className="mr-2" /> 扩写世界观
                    </button>
                  )
                )}
              </div>
            </div>

            {/* 角色设定区域 */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="flex justify-between items-center p-6 border-b">
                <h2 className="text-xl font-semibold flex items-center">
                  <FiUser className="mr-2" /> 角色设定
                </h2>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {output.characters.map((char, index) => (
                    <div
                      key={index}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <h3 className="font-bold text-lg text-indigo-700">
                        {char.name}
                      </h3>
                      <p className="text-sm text-gray-500 mb-2">{char.role}</p>
                      <p className="text-gray-700 mb-2">{char.description}</p>
                      <p className="text-sm">
                        <span className="font-medium">动机：</span>
                        <span className="text-gray-600">{char.motivation}</span>
                      </p>
                    </div>
                  ))}
                </div>

                {interactionMode === "characters" ? (
                  <CharacterInteractionPanel />
                ) : (
                  <button
                    onClick={() => startInteraction("characters")}
                    disabled={output.characters.length === 0}
                    className={`mt-4 px-4 py-2 rounded-md flex items-center ${
                      output.characters.length === 0
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-indigo-600 hover:bg-indigo-700 text-white"
                    }`}
                  >
                    <FiEdit className="mr-2" /> 新增角色
                  </button>
                )}
              </div>
            </div>

            {/* 对话树 */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <FiMessageSquare className="mr-2" /> 关键对话
              </h2>
              {isGenerating && output.dialogues.length === 0 ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-20 bg-gray-200 rounded"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {output.dialogues.map((dialogue, i) => (
                    <div key={i} className="border rounded-lg p-4">
                      <h4 className="font-medium text-gray-800 mb-2">
                        {dialogue.scene}
                      </h4>
                      <div className="space-y-3">
                        {dialogue.lines.map((line, j) => (
                          <div key={j} className="flex">
                            <div className="font-medium text-indigo-600 min-w-[80px]">
                              {line.speaker}:
                            </div>
                            <div className="text-gray-700 flex-1">
                              "{line.text}"
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryExpander;
