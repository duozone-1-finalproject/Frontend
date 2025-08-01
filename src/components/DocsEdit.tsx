import React, { useState } from 'react';
import { ClockIcon, ChatBubbleBottomCenterTextIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline'; // 또는 /24/solid

interface SidebarProps {
  show: boolean;
  onClose?: () => void;
  onChatbotClick?: () => void;
}

const DocsEdit = () => {
    return (
        <div>
            <h1>DocsEdit</h1>
        </div>
    );
};

export default DocsEdit;
