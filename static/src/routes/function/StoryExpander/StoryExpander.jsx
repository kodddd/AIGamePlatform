// src/pages/StoryExpander.jsx
import { useState } from "react";
import {
  FiBook,
  FiSettings,
  FiCopy,
  FiRefreshCw,
  FiSave,
  FiPlus,
  FiEdit,
  FiMessageSquare,
} from "react-icons/fi";
import { useAuth } from "../../../api/auth/context";
import { storyExpanderApi } from "../../../api/storyExpander/storyExpanderApi";
import toast from "react-hot-toast";

const StoryExpander = () => {
  // 状态管理
  const [inputText, setInputText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [output, setOutput] = useState({
    background: "", // 世界观内容
    conversationCount: 0,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [settings, setSettings] = useState({
    creativity: 0,
    casualty: 1,
    genre: "奇幻",
  });
  const [isCopying, setIsCopying] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [continuePrompt, setContinuePrompt] = useState(""); // 继续对话的输入
  const [isContinuing, setIsContinuing] = useState(false); // 继续对话的加载状态

  // 认证检查
  const { user, isAuthenticated, logout } = useAuth();
  if (!isAuthenticated) {
    return <p>请先登录</p>;
  }

  // 复制内容函数
  const handleCopyContent = async () => {
    if (!output.background) return;

    setIsCopying(true);
    try {
      await navigator.clipboard.writeText(output.background);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      toast.error("复制失败");
    } finally {
      setIsCopying(false);
    }
  };

  // 生成世界观（无限次）
  const handleGenerateWorldview = async () => {
    if (!inputText.trim()) return;

    setIsGenerating(true);
    try {
      const response = await storyExpanderApi.expandStory({
        text: inputText,
        settings,
      });
      setOutput({
        background: response.content,
        conversationCount: 0,
      });
    } catch (error) {
      console.error("生成错误:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  // 继续对话
  const handleContinueConversation = async () => {
    if (
      !output.background ||
      output.conversationCount >= 5 ||
      !continuePrompt.trim()
    )
      return;

    setIsContinuing(true);
    try {
      const response = await storyExpanderApi.continueStory({
        currentContent: output.background,
        prompt: continuePrompt,
        settings,
      });

      setOutput((prev) => ({
        background: `${response.content}\n\n---\n\n${prev.background}`,
        conversationCount: prev.conversationCount + 1,
      }));
      setContinuePrompt("");
    } catch (error) {
      console.error("继续对话错误:", error);
    } finally {
      setIsContinuing(false);
    }
  };

  // 保存到知识库处理函数
  const handleSaveToKnowledgeBase = async () => {
    if (!output.background || isSaving) return;

    setIsSaving(true);
    setSaveSuccess(false);

    try {
      // 实际保存API调用
      // await yourSaveApiCall(output);
      setSaveSuccess(true);
    } catch (error) {
      console.error("保存错误:", error);
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center">
              <FiBook className="mr-2" /> 故事扩写引擎
            </h1>
            <p className="text-gray-600 mb-5">
              输入简要世界观，AI将自动生成完整的游戏叙事素材
            </p>
          </div>

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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧输入和设置面板 - 完整保留 */}
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
                  <option value="奇幻">奇幻</option>
                  <option value="科幻">科幻</option>
                  <option value="现代">现代</option>
                  <option value="恐怖">恐怖</option>
                  <option value="">其他</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
            </div>

            <h2 className="text-xl font-semibold mt-6 mb-4">世界观输入</h2>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="例：一个被遗忘的古代文明沉没在海底，其科技远超现代..."
              className="w-full h-40 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />

            <button
              onClick={handleGenerateWorldview}
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

          {/* 右侧输出区域 */}
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                <FiMessageSquare className="inline mr-2" />
                扩写背景
              </h2>
              {output.background && (
                <div className="text-sm text-gray-500">
                  对话次数: {output.conversationCount}/5
                </div>
              )}
            </div>

            {/* 世界观展示区域 */}
            <div className="mb-6 p-4 bg-gray-50 rounded-md h-[500px] overflow-y-auto">
              <div className="whitespace-pre-line break-words">
                {output.background}
              </div>
              {output.background && (
                <div className="absolute top-2 right-2 flex items-center">
                  {copySuccess && (
                    <span className="mr-2 text-sm text-green-600">已复制!</span>
                  )}
                  <button
                    onClick={handleCopyContent}
                    disabled={isCopying || !output.background}
                    className={`p-2 rounded-md ${
                      isCopying || !output.background
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-600 hover:text-indigo-600 hover:bg-gray-100"
                    }`}
                    title="复制内容"
                  >
                    {isCopying ? (
                      <FiRefreshCw className="animate-spin" />
                    ) : (
                      <FiCopy />
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* 继续对话区域 */}
            {output.background && output.conversationCount < 5 && (
              <div className="mt-4">
                <div className="flex items-center mb-2">
                  <h3 className="text-lg font-medium">继续对话</h3>
                  <span className="ml-2 text-sm text-gray-500">
                    ({5 - output.conversationCount}次剩余)
                  </span>
                </div>
                <textarea
                  value={continuePrompt}
                  onChange={(e) => setContinuePrompt(e.target.value)}
                  placeholder="输入你的指令，引导AI继续生成..."
                  className="w-full h-20 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mb-2"
                />
                <button
                  onClick={handleContinueConversation}
                  disabled={isContinuing || !continuePrompt.trim()}
                  className={`px-4 py-2 rounded-md font-medium flex items-center ${
                    isContinuing || !continuePrompt.trim()
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                  }`}
                >
                  {isContinuing ? (
                    <>
                      <FiRefreshCw className="animate-spin mr-2" />
                      生成中...
                    </>
                  ) : (
                    <>
                      <FiPlus className="mr-2" />
                      继续对话
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryExpander;
