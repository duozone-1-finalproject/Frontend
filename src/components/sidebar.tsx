import React, { useState } from 'react';
import { ClockIcon, ChatBubbleBottomCenterTextIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline'; // 또는 /24/solid

interface SidebarProps {
  show: boolean;
  onClose?: () => void;
  onChatbotClick?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ show, onClose, onChatbotClick }) => {
    // "chatbot"/"history"
    const [toggle, setToggle]=useState("chatbot");


    const handleTogleOnClick= (value:string)=>{
        setToggle(value);
    }

    if (!show) return null;
    //일반정렬(비트윈 정렬)

    return (
    <div className="Sidebar flex flex-col justify-between h-full bg-gray-800 text-white p-4" style={{ flexBasis: '250px', flexShrink: 0 }}>
        <div className="flex flex-row justify-center">
            <button onClick={()=>handleTogleOnClick("chatbot")} className="p-2 rounded-full text-white hover:bg-gray-700 transition-colors duration-200">
                <ChatBubbleLeftRightIcon className="h-8 w-8" />
            </button>
            <button onClick={()=>handleTogleOnClick("history")} className="p-2 rounded-full text-white hover:bg-gray-700 transition-colors duration-200">
                <ClockIcon className="h-8 w-8" />
            </button>
        </div>
        <div className="sidebar flex flex-col justify-between h-full">
            <div className="sidebar-message">
                <p>toggle: {toggle}</p>
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
