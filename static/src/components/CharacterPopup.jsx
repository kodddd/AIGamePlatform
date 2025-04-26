import { FiX } from "react-icons/fi";
import { useEffect } from "react";

const CharacterPopup = ({ character, onClose }) => {
  if (!character) return null;

  const handleOutsideClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleOutsideClick}
    >
      <div
        className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              {character.character_name}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <FiX size={24} />
            </button>
          </div>

          <div className="mb-6">
            {character.base_image ? (
              <img
                src={character.base_image}
                alt={character.character_name}
                className="w-full h-64 object-contain rounded-lg"
              />
            ) : (
              <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-gray-400 text-lg">暂无图片</div>
              </div>
            )}
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold mb-2 text-gray-700">
              人物描述
            </h3>
            <div className="whitespace-pre-line text-gray-800 p-3 rounded">
              {character.character_description || "暂无描述"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterPopup;
