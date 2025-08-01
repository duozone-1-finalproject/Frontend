// src/pages/EditPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import Sidebar from '../components/Sidebar'; // Sidebar 컴포넌트 임포트
import TextEditor from '../components/TextEditor'; // TextEditor 컴포넌트 임포트 (새로 만든 파일)

const EditPage = () => {
  const navigate = useNavigate();

  // 보고서 내용을 관리할 상태
  // !!! 임시 수정: 백엔드 없이 에디터가 보이도록 초기 HTML 콘텐츠를 설정 !!!
  const [reportHtmlContent, setReportHtmlContent] = useState<string>('<p>여기에 보고서 내용을 입력해보세요!</p><p>볼드, 이탤릭, 목록 등 다양한 기능을 테스트해볼 수 있습니다.</p>');
  // !!! 임시 수정: 백엔드 없이 에디터가 보이도록 reportId를 999로 설정 (null이 아니면 에디터 렌더링) !!!
  const [reportId, setReportId] = useState<number | null>(999); // 현재 편집 중인 보고서의 ID
  const [reportTitle, setReportTitle] = useState<string>('증권신고서'); // 보고서 제목 (폼 데이터에서 가져올 수도 있음)

  // 챗봇 관련 상태 (Sidebar에서 사용될 수 있음)
  const [showSidebar, setShowSidebar] = useState(true); // 사이드바 표시 여부

  // 보고서 불러오기 함수
  // 현재 백엔드 기능이 없으므로 이 함수는 실제로 동작하지 않으며, 에러를 피하도록 콘솔 로그만 남겨둠.
  const fetchReport = async (id: number) => {
    console.log(`[임시] 보고서 ID ${id} 불러오기 시도 (백엔드 기능 없음)`);
    // 백엔드 API가 구현되면 이 주석을 해제하고 실제 axios.get 호출을 사용하세요.
    /*
    try {
      const response = await axios.get(`/api/reports/${id}`);
      setReportHtmlContent(response.data.htmlContent);
      setReportTitle(response.data.title || '증권신고서');
      setReportId(id);
    } catch (error) {
      console.error("보고서 불러오기 실패:", error);
      alert("보고서를 불러올 수 없습니다.");
      setReportHtmlContent('<p>보고서를 불러오지 못했습니다. 새 내용을 입력해주세요.</p>');
      setReportId(null); // 에러 시 ID 초기화
    }
    */
  };

  // 보고서 저장 함수
  // 현재 백엔드 기능이 없으므로 저장 동작 안 하며, 메시지만 표시.
  const saveReport = async () => {
    if (!reportId) {
      alert("저장할 보고서 ID가 없습니다. 먼저 보고서를 로드해주세요.");
      return;
    }
    console.log("[임시] 보고서 저장 시도 (백엔드 기능 없음):", reportHtmlContent);
    alert("보고서 저장 기능은 백엔드가 구현되어야 작동합니다.");
    // 백엔드 API가 구현되면 이 주석을 해제하고 실제 axios.put 호출을 사용하세요.
    /*
    try {
      await axios.put(`/api/reports/${reportId}`, {
        title: reportTitle, // 제목도 함께 저장 가능
        htmlContent: reportHtmlContent
      });
      alert("보고서가 성공적으로 저장되었습니다!");
    } catch (error) {
      console.error("보고서 저장 실패:", error);
      alert("보고서 저장에 실패했습니다.");
    }
    */
  };

  // TextEditor의 내용이 변경될 때 호출될 콜백 함수
  const handleEditorContentChange = (html: string) => {
    setReportHtmlContent(html);
    // console.log("에디터 변경된 HTML:", html); // 디버깅용
  };

  // 컴포넌트 마운트 시 기본 보고서 로드 (예시)
  // !!! 임시 수정: 백엔드 없이 에디터를 보이도록 reportId를 직접 설정 !!!
  useEffect(() => {
    // 백엔드 API가 없으므로 fetchReport(123) 호출 대신 임시 ID를 설정하여 에디터를 보이게 함
    setReportId(999); // 이 값을 설정하면 reportId가 null이 아니므로 TextEditor가 렌더링됩니다.
  }, []); // 빈 배열은 컴포넌트가 처음 마운트될 때 한 번만 실행됨

  return (
    // 가장 바깥쪽 컨테이너: 화면 전체를 채우도록 설정 (h-screen, w-screen)
    <div className="security-report-container h-screen w-screen flex bg-gradient-to-b from-blue-200 to-blue-100">
      {/* Sidebar 컴포넌트: 왼쪽에 고정 너비로 */}
      <Sidebar show={showSidebar} onClose={() => setShowSidebar(false)} />

      {/* 메인 컨텐츠 영역: Sidebar를 제외한 남은 공간을 모두 채우도록 flex-grow, h-full, w-full, max-w-full 설정 */}
      {/* 이 영역을 다시 flex로 나누어 왼쪽은 폼/뷰어, 오른쪽은 에디터 */}
      <div className="main-content flex flex-grow h-full max-w-full rounded-lg shadow-lg overflow-hidden bg-white">
        {/* 좌측 (보고서 뷰어 / 폼 영역) - 챗봇이 들어갈 자리일수도 있음 */}
        {/* 현재는 '증권신고서' 더미 폼 내용이 들어가는 곳 */}
        <div className="w-2/5 flex flex-col p-8 overflow-y-auto border-r border-gray-200"> {/* w-2/5로 비율 조정 */}
          <div className="header-bar flex justify-between items-center pb-4 border-b border-gray-200 mb-8">
            <span className="close-icon text-gray-400 text-xl font-bold cursor-pointer" onClick={() => navigate('/main')}>X</span>
            <h1 className="header-title text-xl font-bold text-gray-800">{reportTitle}</h1> {/* 동적으로 제목 표시 */}
            <button
                onClick={saveReport} // 저장 버튼
                className="modify-button px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
            >
                저장하기
            </button>
          </div>

          <div className="report-title-section text-center mb-12">
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
        <div className="w-3/5 p-4 flex flex-col bg-gray-50 overflow-y-auto"> {/* w-3/5로 비율 조정 */}
          <h2 className="text-xl font-bold mb-4 text-gray-700">보고서 내용 편집</h2>
          {/* !!! 임시 수정으로 reportId가 항상 존재하므로, TextEditor가 항상 렌더링됨 !!! */}
          <TextEditor
            initialContent={reportHtmlContent}
            onContentChange={handleEditorContentChange}
          />
          {/* reportId가 null일 때 표시되는 메시지는 이제 보이지 않을 것입니다. */}
        </div>
      </div>
    </div>
  );
};

export default EditPage;