// components/main/LeftContent.tsx
import React, { useState } from 'react';
import { ChevronRight, Loader2 } from 'lucide-react';
import { CompanySearchModal } from './Modal';

interface LeftContentProps {
  isGenerating: boolean;
  onGenerateSecurities: (companyCode: string) => Promise<void>;
}

export const LeftContent: React.FC<LeftContentProps> = ({
  isGenerating,
  onGenerateSecurities
}) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="flex-1 pr-12">
      <div className="max-w-2xl">
        {/* Main Title */}
        <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-6">
          <span className="text-blue-600">Smart Editor:</span>
          <br />
          증권신고서 초안
          <br />
          AI 자동생성
        </h1>

        {/* Description */}
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          복잡한 증권신고서 초안 작성을 돕습니다.
          AI 기반 자동 생성 시스템으로 정확하고 효율적인 증권신고서 초안을
          빠르게 작성하고, 오류 검토까지 한 번에 완료합니다.
        </p>

        {/* CTA Button */}
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 w-5 h-5 animate-spin" />
              <span>생성 중...</span>
            </>
          ) : (
            <>
              <span>증권신고서 초안 생성</span>
              <ChevronRight className="ml-2 w-5 h-5" />
            </>
          )}
        </button>

        {/* Company Search Modal */}
        <CompanySearchModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSelectCompany={(corpCode: string) => {
            setShowModal(false);
            onGenerateSecurities(corpCode);
          }}
        />
      </div>
    </div>
  );
};