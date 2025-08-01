// src/pages/EditPage.tsx (에러 수정 버전)
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/sidebar';
import TextEditor from '../components/TextEditor';

const EditPage = () => {
  const navigate = useNavigate();

  // 초기 컨텐츠를 간단한 HTML로 설정
  const [reportHtmlContent, setReportHtmlContent] = useState<string>(`
    <h1>증 권 신 고 서</h1>
    <h2>( 지 분 증 권 )</h2>
    <br>
    <p><strong>금융위원회 귀중</strong></p>
    <p style="text-align: right;">2022년 08월 16일</p>
    <br>
    <p><strong>회 사 명:</strong></p>
    <hr />
    <p><strong>대 표 이 사:</strong></p>
    <hr />
    <p><strong>본 점 소 재 지:</strong></p>
    <hr />
    <br>
    <p><strong>작 성 책 임 자:</strong></p>
    <hr />
    <br>
    <p><strong>모집 또는 매출 증권의 종류 및 수:</strong></p>
    <hr />
    <br>
    <p>--------------------------------------------------</p>
    <p>이 부분부터는 AI가 생성한 실제 보고서 본문 내용이 들어갈 수 있습니다.</p>
    <p>위의 양식과 달리 자유롭게 수정하고 입력할 수 있는 공간입니다.</p>
    <p>여기에 텍스트를 입력하고 툴바 버튼을 사용해보세요.</p>
    <p><strong>볼드</strong>, <em>이탤릭</em>, <u>밑줄</u> 등 다양한 기능을 테스트해보세요.</p>
    <ul>
      <li>목록 항목 1</li>
      <li>목록 항목 2</li>
    </ul>
    <ol>
      <li>번호 목록 1</li>
      <li>번호 목록 2</li>
    </ol>
  `);

  const [reportId, setReportId] = useState<number | null>(999);
  const [reportTitle, setReportTitle] = useState<string>('증권신고서');
  const [showSidebar, setShowSidebar] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // 보고서 불러오기 함수 (향후 백엔드 연결용)
  const fetchReport = async (id: number) => {
    console.log(`[임시] 보고서 ID ${id} 불러오기 시도 (백엔드 기능 없음)`);
    // 백엔드 연결 시 여기서 실제 데이터를 불러와 setReportHtmlContent 호출
  };

  // 보고서 저장 함수
  const saveReport = useCallback(async () => {
    if (!reportId) {
      alert("저장할 보고서 ID가 없습니다. 먼저 보고서를 로드해주세요.");
      return;
    }

    setIsSaving(true);
    try {
      console.log("[임시] 보고서 저장 시도 (백엔드 기능 없음):", reportHtmlContent);
      
      // 실제 백엔드 연결시 사용할 코드:
      // const response = await axios.post(`/api/reports/${reportId}`, {
      //   content: reportHtmlContent,
      //   title: reportTitle
      // });
      
      // 저장 시뮬레이션 (2초 대기)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setLastSaved(new Date());
      alert("보고서가 성공적으로 저장되었습니다!");
      
    } catch (error) {
      console.error("보고서 저장 실패:", error);
      alert("보고서 저장에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSaving(false);
    }
  }, [reportId, reportHtmlContent, reportTitle]);

  // 에디터 내용 변경 핸들러
  const handleEditorContentChange = useCallback((html: string) => {
    setReportHtmlContent(html);
  }, []);

  // 키보드 단축키 (Ctrl+S로 저장)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        saveReport();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [saveReport]);

  // 자동 저장 기능 (30초마다)
  useEffect(() => {
    if (reportHtmlContent && reportId) {
      const autoSaveTimer = setTimeout(() => {
        console.log("자동 저장 시도...");
        // 자동 저장이 필요하다면 여기서 saveReport() 호출
      }, 30000);

      return () => clearTimeout(autoSaveTimer);
    }
  }, [reportHtmlContent, reportId]);

  // 페이지 로드 시 초기화
  useEffect(() => {
    setReportId(999);
    // fetchReport(999); // 실제 백엔드 연결 시 활성화
  }, []);

  // 페이지 이탈 시 저장 확인
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!lastSaved || (new Date().getTime() - lastSaved.getTime()) > 60000) {
        e.preventDefault();
        e.returnValue = '변경사항이 저장되지 않았습니다. 정말 페이지를 나가시겠습니까?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [lastSaved]);

  return (
    <div className="security-report-container h-screen w-screen flex bg-gradient-to-b from-blue-200 to-blue-100">
      <Sidebar show={showSidebar} onClose={() => setShowSidebar(false)} />

      <div className="main-content flex flex-grow h-full max-w-full rounded-lg shadow-lg overflow-hidden bg-white">
        {/* 좌측 (보고서 뷰어 / 폼 영역) */}
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
              onClick={saveReport}
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

          {/* 저장 상태 표시 */}
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
          
          {/* 편집 가이드 */}
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

        {/* 우측 (TipTap 에디터 영역) */}
        <div className="w-3/5 p-4 flex flex-col bg-gray-50 overflow-hidden">
          <h2 className="text-xl font-bold mb-4 text-gray-700">보고서 내용 편집</h2>
          <div className="flex-1 overflow-hidden">
            <TextEditor
              initialContent={reportHtmlContent}
              onContentChange={handleEditorContentChange}
              isReadOnly={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPage;