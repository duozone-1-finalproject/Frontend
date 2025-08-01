import React from "react";

interface SidebarProps {
  show: boolean;
  onClose?: () => void;
  onChatbotClick?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ show, onClose, onChatbotClick }) => {
  if (!show) return null;
    //일반정렬(비트윈 정렬)
  return (
    <div className="sidebar flex flex-col justify-between h-full bg-gray-800 text-white p-4" style={{ flexBasis: '250px', flexShrink: 0 }}>
        <div className="flex flex-col">
            (히스)
        </div>
        <div className="sidebar flex flex-col justify-between h-full">
            <div className="sidebar-message">
                <p>필요한 자료들을 불러오는 중입니다......</p>
                <p>모두 준비되었습니다!</p>
                <p>원하시는 신고서를 선택해주세요!</p>
            </div>
            <div className="sidebar-input mt-auto"> {/* mt-auto로 아래로 밀어내기 */}
                <input type="text" placeholder="무엇이든 물어보세요." className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white placeholder-gray-400" />
            </div>
        </div>
        
        
      </div>
  );
};

export default Sidebar;
