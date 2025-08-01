// src/pages/EditPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TextEditor from '../components/TextEditor';

const EditPage = () => {
  const navigate = useNavigate();

  const [reportHtmlContent, setReportHtmlContent] = useState<string>(''); // 초기 빈 문자열
  const [reportId, setReportId] = useState<number | null>(null);
  const [reportTitle, setReportTitle] = useState<string>('증권신고서');
  const [showSidebar, setShowSidebar] = useState(true);

  // 템플릿 HTML을 public 폴더에서 불러오기
  useEffect(() => {
    const loadTemplate = async () => {
      try {
        const response = await fetch('/report_template.html');
        const html = await response.text();
        setReportHtmlContent(html);
        setReportId(999);
      } catch (error) {
        console.error('템플릿 로딩 실패:', error);
      }
    };

    loadTemplate();
  }, []);

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

  return (
    <div className="security-report-container h-screen w-screen flex bg-gradient-to-b from-blue-200 to-blue-100">
      <Sidebar show={showSidebar} onClose={() => setShowSidebar(false)} />

      <div className="main-content flex flex-grow h-full max-w-full rounded-lg shadow-lg overflow-hidden bg-white">
        {/* 우측 (Tiptap 에디터 영역) */}
        <div className="p-4 flex flex-col bg-gray-50 overflow-y-auto w-full">
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
