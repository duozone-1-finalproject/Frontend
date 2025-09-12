// components/main/GenerationResultModal.tsx
import React from 'react';

interface GenerationResultModalProps {
  isOpen: boolean;
  generatedData: Record<string, any> | null;
  onClose: () => void;
  onGoToViewer: () => void;
}

export const GenerationResultModal: React.FC<GenerationResultModalProps> = ({
  isOpen,
  generatedData,
  onClose,
  onGoToViewer
}) => {
  if (!isOpen || !generatedData) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">생성 완료</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">증권신고서 초안이 생성되었습니다</h4>
            <p className="text-gray-600 mb-2">
              회사명: {generatedData.company_name || '정보 없음'}
            </p>
            <p className="text-gray-600 mb-6">
              CEO: {generatedData.ceo_name || '정보 없음'}
            </p>
            
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                닫기
              </button>
              <button
                onClick={onGoToViewer}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                편집기로 이동
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};