// src/pages/Home.jsx
import { Link } from "react-router-dom";
import { FiCode, FiBook, FiLayers, FiImage } from "react-icons/fi";
import { RiRobotLine } from "react-icons/ri";

const Home = () => {
  const features = [
    {
      icon: <FiBook className="w-8 h-8" />,
      title: "故事扩写引擎",
      desc: "输入简单世界观梗概，自动生成完整的游戏背景故事、角色设定和对话树",
      color: "from-purple-500 to-indigo-500",
      link: "/story-expander",
    },
    {
      icon: <FiCode className="w-8 h-8" />,
      title: "动态剧情生成",
      desc: "根据玩家选择实时生成分支剧情，打造无限可能的叙事体验",
      color: "from-blue-500 to-cyan-400",
    },
    {
      icon: <FiImage className="w-8 h-8" />,
      title: "AI视觉工坊",
      desc: "文字描述生成2D立绘/3D模型贴图，支持风格化参数调节",
      color: "from-green-500 to-emerald-400",
      link: "/visual-workshop",
    },
    {
      icon: <FiLayers className="w-8 h-8" />,
      title: "智能关卡设计",
      desc: "基于游戏类型自动生成地图布局与敌人配置方案",
      color: "from-amber-500 to-yellow-400",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-hidden">
      {/* 科技感粒子背景 */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-blue-400"
            style={{
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 10 + 10}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* 主内容区 */}
      <div className="relative z-10 container mx-auto px-6 py-24">
        {/* 平台标识 */}
        <div className="flex items-center justify-center mb-2">
          <RiRobotLine className="text-blue-400 text-4xl mr-3" />
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
            AI游戏实验室
          </span>
        </div>

        {/* 主标题 */}
        <h1 className="text-5xl md:text-6xl font-bold text-center mb-6 leading-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
            下一代游戏创作
          </span>
          <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
            人工智能工作流
          </span>
        </h1>

        {/* 副标题 */}
        <p className="text-xl text-gray-300 text-center max-w-3xl mx-auto mb-12">
          集成最先进的大语言模型与生成式AI，为独立开发者和3A工作室提供全流程智能辅助工具链
        </p>

        {/* 行动按钮 */}
        <div className="flex justify-center space-x-4 mb-24">
          <Link
            to="/register"
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg font-medium text-lg hover:shadow-lg transition-all hover:scale-105"
          >
            立即体验
          </Link>
          <Link
            to="/demo"
            className="px-8 py-4 border-2 border-cyan-400 text-cyan-400 rounded-lg font-medium text-lg hover:bg-cyan-400/10 transition-all"
          >
            观看演示
          </Link>
        </div>

        {/* 功能展示 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((item, index) => (
            <Link
              to={item.link || "#"} // Use the link if available, otherwise default to "#"
              key={index}
              className="bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-gray-700 hover:border-cyan-400/30 transition-all hover:-translate-y-2 block" // Added 'block' class
            >
              <div
                className={`mb-4 inline-flex p-3 rounded-lg bg-gradient-to-r ${item.color}`}
              >
                {item.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-gray-400">{item.desc}</p>
            </Link>
          ))}
        </div>

        {/* 技术栈提示 */}
        <div className="mt-24 text-center text-gray-400">
          <p>
            支持 OpenAI GPT-4 · Claude 3 · Stable Diffusion · Unity插件 ·
            Unreal引擎扩展
          </p>
        </div>
      </div>

      {/* 全局样式（动画定义） */}
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-100px) translateX(20px);
          }
          100% {
            transform: translateY(0) translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Home;
