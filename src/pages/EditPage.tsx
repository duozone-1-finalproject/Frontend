// src/pages/EditPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import Sidebar from '../components/Sidebar';
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

const [sidebar,setSidebar]= useState<boolean>(true);

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
        <Sidebar show={sidebar} />

        <div className="main-content flex flex-grow h-full max-w-full rounded-lg shadow-lg overflow-hidden bg-white">
            <div className={`flex flex-col w-full h-full ${sidebar? "max-w-70vw":"max-w-vw"} bg-white rounded-lg shadow-lg`}>
                {/* 상단 헤더 바: X, 증권신고서 제목, 현재버전 셀렉트, 수정하기 버튼 */}
                {/* flex-none: 이 헤더의 높이가 내용에 따라 고정되도록 하여 flex-grow가 적용된 아래 컨텐츠 영역이 나머지 공간을 채우도록 함 */}
                <div className="header-top-bar flex-none flex items-center justify-between p-4 border-b border-gray-200">
                    <span className="close-icon text-gray-400 text-xl font-bold cursor-pointer" onClick={()=>setSidebar(!sidebar)}>☰</span>
                    {/* 이미지와 같이 '증권신고서' 제목이 중앙에 가깝도록 flex-grow를 사용하여 양옆의 여백을 조절하거나,
                        단순히 flex-grow를 주지 않고 content의 자연스러운 중앙 정렬을 이용할 수도 있습니다.
                        여기서는 `mr-auto ml-auto` 조합으로 중앙 정렬하고 텍스트 정렬을 명시합니다. */}
                    <h1 className="header-title flex-grow text-center text-xl font-bold text-gray-800">증권신고서</h1>
                    <div className="flex items-center space-x-4"> {/* 기존 ml-auto는 h1에 중앙 정렬을 위해 제거 */}
                        <select className="w-[120px] p-1 border border-gray-300 rounded text-gray-700 text-sm">
                            <option>현재버전</option>
                        </select>
                        <button className="modify-button px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50">수정하기</button>
                    </div>
                </div>

                {/* 주요 폼 컨텐츠 영역 (좌측 폼과 우측 빈 공간) */}
                {/* flex-grow: 상단 헤더를 제외한 남은 세로 공간을 모두 채웁니다. */}
                <div className="flex flex-grow overflow-y-auto"> {/* 내용이 길어지면 스크롤 가능하게 */}
                    {/* 좌측 (2/5) 영역 - 실제 폼 내용이 들어가는 부분 */}
                    <div className="w-full bg-white flex flex-col p-8">
                        <div className="report-title-section text-center mb-12 mt-8"> {/* 이미지와 비슷하게 mt-8 추가 */}
                            <h2 className="main-report-korean-title text-5xl font-extrabold mb-2">
                                <span className="text-blue-600">증 권 신 고 서</span>
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