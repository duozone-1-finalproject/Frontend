// components/main/RightContent.tsx
import React from 'react';

export const RightContent: React.FC = () => {
  return (
    <div className="flex-1">
      <div className="relative">
        {/* Document Mockup */}
        <div className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden transform rotate-3 hover:rotate-0 transition-transform duration-300">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-400 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span className="ml-4 text-sm text-gray-600">증권신고서 초안.docx</span>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-bold text-gray-900">증권신고서</h3>
              <p className="text-sm text-gray-600 mt-1">(주식회사 컴맹테크)</p>
            </div>

            <div className="space-y-3">
              <div className="h-2 bg-gray-200 rounded"></div>
              <div className="h-2 bg-gray-200 rounded w-4/5"></div>
              <div className="h-2 bg-gray-200 rounded w-3/4"></div>
              <div className="h-2 bg-gray-200 rounded w-5/6"></div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-6">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
                  <span className="text-sm font-medium text-yellow-800">AI 검토 완료</span>
                </div>
                <p className="text-sm text-yellow-700 mt-1">
                  법적 요구사항 98% 충족, 추가 검토 권장 사항 2건
                </p>
              </div>

              <div className="space-y-2 mt-4">
                <div className="h-2 bg-gray-200 rounded w-full"></div>
                <div className="h-2 bg-gray-200 rounded w-2/3"></div>
                <div className="h-2 bg-gray-200 rounded w-4/5"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute -top-4 -left-4 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
          자동생성 완료
        </div>
        <div className="absolute -bottom-4 -right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
          검토 완료
        </div>
      </div>
    </div>
  );
};