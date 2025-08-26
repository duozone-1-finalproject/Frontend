// components/main/MainPageSections.tsx (새로운 컴포넌트)
import React from 'react';

interface SecurityButtonProps {
  text: string;
  index: number;
  onClick: () => void;
}

const SecurityButton: React.FC<SecurityButtonProps> = ({ text, index, onClick }) => {
  const getButtonStyle = (idx: number) => {
    const styles = [
      'bg-[#EDE6E6] hover:bg-[#E0D9D9]',
      'bg-[#D5CBCB] hover:bg-[#C8BFBF]',
      'bg-[#A4A0A0] hover:bg-[#979393]',
      'bg-[#706E6E] hover:bg-[#636161]',
    ];
    return styles[idx] || styles[0];
  };

  return (
    <button
      className={`
        w-full text-left px-6 py-8 text-lg font-semibold border-b
        transition-colors duration-200 ease-in-out text-black
        ${getButtonStyle(index)}
      `}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export const PageTitleSection: React.FC = () => (
  <div className="px-7 py-6 border-b">
    <h2 className="text-2xl font-bold text-black">
      증권신고서 <span className="text-lg text-gray-700">| 발행공시</span>
    </h2>
  </div>
);

export const HeroSection: React.FC = () => (
  <div className="w-full">
    <img
      src="/img/main_cat.jpg"
      alt="배경"
      className="w-full max-h-[600px] object-cover"
    />
  </div>
);

interface SecurityButtonsSectionProps {
  onSecurityClick: () => void;
}

export const SecurityButtonsSection: React.FC<SecurityButtonsSectionProps> = ({ onSecurityClick }) => {
  const securities = ['지분증권', '채무증권', '증권예약', '투자예약'];

  return (
    <div className="w-full">
      {securities.map((text, idx) => (
        <SecurityButton
          key={text}
          text={text}
          index={idx}
          onClick={onSecurityClick}
        />
      ))}
    </div>
  );
};
