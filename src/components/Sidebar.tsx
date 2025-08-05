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

    const Chatbot=()=>{
        return(
            <div className="sidebar flex flex-col justify-between h-full">
            <div className="sidebar-message">
                <div className="sidebar-message-content flex justify-end mt-2 mb-3">  
                    <div className="sidebar-message-content-item bg-gray-300 text-gray-800 p-3 rounded-lg max-w-xs">
                        내가 입력한 채팅
                    </div>
                </div>
                <div className="sidebar-message-content flex justify-start mt-2 mb-3">  
                    <div className="sidebar-message-content-item bg-gray-300 text-gray-800 p-3 rounded-lg max-w-xs">
                        챗봇이 입력한 
                    </div>
                </div>
                <div className="sidebar-message-content flex justify-start mt-2 mb-3">  
                    <div className="sidebar-message-content-item bg-gray-300 text-gray-800 p-3 rounded-lg max-w-xs">
                        챗봇이 입력한 
                    </div>
                </div>
            </div>
            <div className="sidebar-input mt-auto "> {/* mt-auto로 아래로 밀어내기 */}
                <input type="text" placeholder="무엇이든 물어보세요." className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white placeholder-gray-400" />
            </div>
        </div>
        ); 
    }

    const History=()=>{
        return(
            <div className="sidebar flex flex-col h-full">
                <div className="history-log bg-gray-300 text-gray-800 p-3 rounded-lg max-w-xs mb-2">
                    <p>Q. 질문요약</p>
                    <p>A. 질문답변</p>
                </div>
                <div className="history-log bg-gray-300 text-gray-800 p-3 rounded-lg max-w-xs mb-2">
                    <p>Q. 질문요약</p>
                    <p>A. 질문답변</p>
                </div>
                <div className="history-log bg-gray-300 text-gray-800 p-3 rounded-lg max-w-xs mb-2">
                    <p>Q. 질문요약</p>
                    <p>A. 질문답변</p>
                </div>
            </div>
        );
    }
    
    if (!show) return null;
    //일반정렬(비트윈 정렬)

    return (
    <div className="Sidebar flex flex-col justify-between h-full bg-gray-800 text-white p-4" style={{ flexBasis: '350px', flexShrink: 0 }}>
        <div className="flex flex-row justify-center">
            <button onClick={()=>handleTogleOnClick("chatbot")} className="p-2 rounded-full text-white hover:bg-gray-700 transition-colors duration-200">
                <ChatBubbleLeftRightIcon className="h-8 w-8" />
            </button>
            <button onClick={()=>handleTogleOnClick("history")} className="p-2 rounded-full text-white hover:bg-gray-700 transition-colors duration-200">
                <ClockIcon className="h-8 w-8" />
            </button>
        </div>
        <hr className="h-2 my-4 border-gray-700 border-t-4" />
        {toggle==="chatbot" ? <Chatbot/> : <History/>}
        
        
    </div>
    );
};

export default Sidebar;
