// src/pages/EditPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import Sidebar from '../components/sidebar';
import TextEditor from '../components/TextEditor';

const EditPage = () => {
  const navigate = useNavigate();

  const [reportHtmlContent, setReportHtmlContent] = useState<string>(`
    <div class="custom-editor-output">
      <h1 class="report-main-title"><strong>증 권 신 고 서</strong></h1>
      <h2 class="report-sub-title">( 지 분 증 권 )</h2>
      <br>
      <p class="form-label-line">금융위원회 귀중</p>
      <p class="date-right">2022년 08월 16일</p>
      <br>
      <p class="form-label-line">회 사 명:</p>
      <p class="form-value-line"></p>
      <p class="form-label-line">대 표 이 사:</p>
      <p class="form-value-line"></p>
      <p class="form-label-line">본 점 소 재 지:</p>
      <p class="form-value-line"></p>
      <br>
      <p class="form-label-line">작 성 책 임 자:</p>
      <p class="form-value-line"></p>
      <br>
      <p class="form-label-line">모집 또는 매출 증권의 종류 및 수:</p>
      <p class="form-value-line"></p>
      <br>
      <p>--------------------------------------------------</p>
      <p>이 부분부터는 AI가 생성한 실제 보고서 본문 내용이 들어갈 수 있습니다.</p>
      <p>위의 양식과 달리 자유롭게 수정하고 입력할 수 있는 공간입니다.</p>
      <p>여기에 텍스트를 입력하고 툴바 버튼을 사용해보세요.</p>
      <p><strong>볼드</strong>, <em>이탤릭</em>, <u>밑줄(Underline - 필요시 확장 추가)</u>, 목록 등 다양한 기능을 테스트해보세요.</p>
    </div>
  `);
  const [reportId, setReportId] = useState<number | null>(999);
  const [reportTitle, setReportTitle] = useState<string>('증권신고서');

  const [showSidebar, setShowSidebar] = useState(true);

  const fetchReport = async (id: number) => {
    console.log(`[임시] 보고서 ID ${id} 불러오기 시도 (백엔드 기능 없음)`);
  };

  const saveReport = async () => {
    if (!reportId) {
      alert("저장할 보고서 ID가 없습니다. 먼저 보고서를 로드해주세요.");
      return;
    }
    console.log("[임시] 보고서 저장 시도 (백엔드 기능 없음):", reportHtmlContent);
    alert("보고서 저장 기능은 백엔드가 구현되어야 작동합니다.");
  };

  const handleEditorContentChange = (html: string) => {
    setReportHtmlContent(html);
  };

  useEffect(() => {
    setReportId(999);
  }, []);

  return (
    <div className="security-report-container h-screen w-screen flex bg-gradient-to-b from-blue-200 to-blue-100">
      <Sidebar show={showSidebar} onClose={() => setShowSidebar(false)} />

      <div className="main-content flex flex-grow h-full max-w-full rounded-lg shadow-lg overflow-hidden bg-white">
        {/* 좌측 (보고서 뷰어 / 폼 영역) */}
        <div className="w-2/5 flex flex-col p-8 overflow-y-auto border-r border-gray-200">
          <div className="header-bar flex justify-between items-center pb-4 border-b border-gray-200 mb-8">
            <span className="close-icon text-gray-400 text-xl font-bold cursor-pointer" onClick={() => navigate('/main')}>X</span>
            <h1 className="header-title text-xl font-bold text-gray-800">{reportTitle}</h1>
            <button
                onClick={saveReport}
                className="modify-button px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
            >
                저장하기
            </button>
          </div>

          <div className="report-title-section text-center mb-12">
            {/* 왼쪽은 여전히 고정된 스타일로 */}
            <h2 className="main-report-korean-title text-5xl font-extrabold mb-2">
              <span className="text-blue-600">{reportTitle.includes('증권신고서') ? '증 권 신 고 서' : reportTitle}</span>
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
        </div>

        {/* 우측 (Tiptap 에디터 영역) */}
        <div className="w-3/5 p-4 flex flex-col bg-gray-50 overflow-y-auto">
          <h2 className="text-xl font-bold mb-4 text-gray-700">보고서 내용 편집</h2>
          <TextEditor
            initialContent={reportHtmlContent}
            onContentChange={handleEditorContentChange}
          />
        </div>
      </div>
    </div>
  );
};

export default EditPage;