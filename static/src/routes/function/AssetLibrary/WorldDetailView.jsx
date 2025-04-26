// src/route/function/AssetLibrary/WorldDetailView.jsx
import { FiGlobe, FiImage, FiBook, FiChevronLeft } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { worldApi } from "../../../api/world/worldApi";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import CharacterPopup from "../../../components/CharacterPopup";
import StoryPopup from "../../../components/StoryPopup";

const WorldDetailView = () => {
  const navigate = useNavigate();
  const { worldId } = useParams();
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [selectedStory, setSelectedStory] = useState(null);

  const {
    data: world,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["getWorld", worldId],
    queryFn: async () => await worldApi.getWorld({ world_id: worldId }),
    enabled: !!worldId,
  });

  useEffect(() => {
    if (isError) {
      toast.error("加载世界观详情失败");
      navigate(-1);
    }
  }, [isError, navigate]);

  if (isLoading) {
    return <div className="p-6 text-center">加载中...</div>;
  }

  if (!world) {
    return <div className="p-6 text-center">世界观不存在</div>;
  }

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        {/* 返回按钮和标题 */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-800 mr-4"
          >
            <FiChevronLeft className="mr-1" /> 返回
          </button>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <FiGlobe className="mr-2" /> {world.world_name}
          </h1>
        </div>

        {/* 世界观基础描述 */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            世界观概述
          </h2>
          <div className="prose max-w-none whitespace-pre-line">
            {world.base_text || "暂无描述"}
          </div>
        </div>

        {/* 人物列表 */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <FiImage className="mr-2" /> 人物列表
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {world.characters?.map((character, index) => (
              <div
                key={index}
                className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedCharacter(character)}
              >
                {character.base_image ? (
                  <img
                    src={character.base_image}
                    alt={character.character_name}
                    className="w-full h-32 object-cover"
                  />
                ) : (
                  <div className="w-full h-32 bg-gray-100 flex items-center justify-center">
                    <FiImage className="text-gray-400 text-2xl" />
                  </div>
                )}
                <div className="p-3">
                  <h3 className="font-medium text-center">
                    {character.character_name}
                  </h3>
                </div>
              </div>
            ))}
            {(!world.characters || world.characters.length === 0) && (
              <p className="text-gray-500 col-span-full text-center py-4">
                暂无人物
              </p>
            )}
          </div>
        </div>

        {/* 剧情列表 */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <FiBook className="mr-2" /> 剧情列表
          </h2>
          <div className="space-y-3">
            {world.storys?.map((story, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => setSelectedStory(story)}
              >
                <h3 className="font-medium">{story.story_name}</h3>
              </div>
            ))}
            {(!world.storys || world.storys.length === 0) && (
              <p className="text-gray-500 text-center py-4">暂无剧情</p>
            )}
          </div>
        </div>
      </div>

      <CharacterPopup
        character={selectedCharacter}
        onClose={() => setSelectedCharacter(null)}
      />

      <StoryPopup
        story={selectedStory}
        onClose={() => setSelectedStory(null)}
      />
    </div>
  );
};

export default WorldDetailView;
