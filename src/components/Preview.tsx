import React from 'react';
import { useNavigate } from 'react-router-dom';

interface PreviewProps {
  reportTitle: string;
  reportHtmlContent: string;
  lastSaved: Date | null;
  isSaving: boolean;
  onSave: () => void;
}

const Preview: React.FC<PreviewProps> = ({
  reportTitle,
  reportHtmlContent,
  lastSaved,
  isSaving,
  onSave,
}) => {
  const navigate = useNavigate();

  return (
    <div className="w-2/5 flex flex-col p-8 overflow-y-auto border-r border-gray-200">
      <div className="header-bar flex justify-between items-center pb-4 border-b border-gray-200 mb-8">
        <span
          className="close-icon text-gray-400 text-xl font-bold cursor-pointer hover:text-gray-600"
          onClick={() => navigate('/main')}
        >
          ✕
        </span>
        <h1 className="header-title text-xl font-bold text-gray-800">{reportTitle}</h1>
        <button
          onClick={onSave}
          disabled={isSaving}
          className={`modify-button px-4 py-2 text-sm border rounded transition-colors ${
            isSaving
              ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
              : 'text-gray-600 border-gray-300 hover:bg-gray-50'
          }`}
        >
          {isSaving ? '저장 중...' : '저장하기'}
        </button>
      </div>

      {lastSaved && (
        <div className="mb-4 p-2 bg-green-50 border border-green-200 rounded text-sm text-green-700">
          마지막 저장: {lastSaved.toLocaleTimeString()}
        </div>
      )}

      <div className="report-title-section text-center mb-12">
        <h2 className="main-report-korean-title text-5xl font-extrabold mb-2">
          <span className="text-blue-600">
            {reportTitle.includes('증권신고서') ? '증 권 신 고 서' : reportTitle}
          </span>
        </h2>
        <p className="sub-report-korean-title text-lg text-gray-600">( 지 분 증 권 )</p>
      </div>

      <div className="form-details-section">
        <div className="form-row flex justify-between items-baseline mb-5">
          <div className="form-label font-semibold text-gray-700 min-w-[150px]">금융위원회 귀중</div>
          <div className="date-display flex gap-4 text-gray-500 text-sm">
            <span>2022년</span>
            <span>08월</span>
            <span>16일</span>
          </div>
        </div>

        <div className="form-row flex mb-5">
          <div className="form-label font-semibold text-gray-700 min-w-[150px]">회 사 명:</div>
          <div className="form-input-placeholder flex-grow border-b border-gray-300 h-6"></div>
        </div>
        <div className="form-row flex mb-5">
          <div className="form-label font-semibold text-gray-700 min-w-[150px]">대 표 이 사:</div>
          <div className="form-input-placeholder flex-grow border-b border-gray-300 h-6"></div>
        </div>
        <div className="form-row flex mb-5">
          <div className="form-label font-semibold text-gray-700 min-w-[150px]">본 점 소 재 지:</div>
          <div className="form-input-placeholder flex-grow border-b border-gray-300 h-6"></div>
        </div>

        <div className="form-row flex mt-10 mb-5">
          <div className="form-label font-semibold text-gray-700 min-w-[150px]">작 성 책 임 자:</div>
          <div className="form-input-placeholder flex-grow border-b border-gray-300 h-6"></div>
        </div>

        <div className="form-row flex mt-10">
          <div className="form-label font-semibold text-gray-700 min-w-[150px]">모집 또는 매출 증권의 종류 및 수:</div>
          <div className="form-input-placeholder flex-grow border-b border-gray-300 h-6"></div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded">
        <h3 className="font-semibold text-blue-800 mb-2">편집 가이드</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• 우측 에디터에서 문서 내용을 자유롭게 편집할 수 있습니다</li>
          <li>• 툴바 버튼을 사용해 서식을 적용하세요</li>
          <li>• Ctrl+S로 언제든지 저장할 수 있습니다</li>
          <li>• 한글 입력이 자연스럽게 동작합니다</li>
          <li>• 커스텀 스타일 버튼으로 문서 양식을 적용하세요</li>
        </ul>
      </div>
    </div>
  );
};

export default Preview;