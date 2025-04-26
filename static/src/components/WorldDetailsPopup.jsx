import { useRef } from "react";
import { FiX } from "react-icons/fi";

const WorldDetailsPopup = ({ world, onClose }) => {
  const popupRef = useRef(null);

  const handleClickOutside = (event) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      onClose();
    }
  };

  if (!world) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleClickOutside}
    >
      <div
        ref={popupRef}
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-xl font-semibold">{world.world_name}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FiX size={24} />
          </button>
        </div>
        <div className="p-4 overflow-y-auto flex-1">
          <h4 className="font-medium text-gray-700 mb-2">世界观基础文本</h4>
          <div className="bg-gray-50 p-3 rounded-md whitespace-pre-wrap text-gray-800">
            {world.base_text}
          </div>
        </div>
        <div className="p-4 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorldDetailsPopup;
