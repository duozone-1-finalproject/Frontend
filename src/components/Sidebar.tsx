import React, { useState } from 'react';
import { ClockIcon, ChatBubbleBottomCenterTextIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline'; // 또는 /24/solid
import {ChatProvider} from '../context/chatContext/ChatContext';

import History from './sidebar/History';
import Chatbot from './sidebar/Chatbot';
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
        <ChatProvider>
            {toggle==="chatbot" ? <Chatbot/> : <History/>}
        </ChatProvider>
        
        
        
    </div>
    );
};

export default Sidebar;
