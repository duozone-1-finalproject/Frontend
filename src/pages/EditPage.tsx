import React, { useState, useRef, useEffect, MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios'; 
import Sidebar from '../components/Sidebar';

const EditPage = () => {
  const navigate = useNavigate();
  const [sidebar, setSidebar] = useState<boolean>(true);
  const [sidebarWidth, setSidebarWidth] = useState<number>(350); // 사이드바 너비를 상태로 관리
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const minWidth = 250; // 사이드바 최소 너비
  const maxWidth = 500; // 사이드바 최대 너비

  // 마우스 다운 이벤트 핸들러: 리사이즈 시작
  const startResizing = (e: MouseEvent) => {
    setIsResizing(true);
  };

  // 마우스 이동 이벤트 핸들러: 너비 조절
  useEffect(() => {
    const handleMouseMove = (e: globalThis.MouseEvent) => {
      if (!isResizing) return;
      const newWidth = e.clientX;
      if (newWidth >= minWidth && newWidth <= maxWidth) {
        setSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      // 리사이즈 중일 때만 전역 이벤트 리스너 추가
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    // 컴포넌트 언마운트 또는 리사이즈 종료 시 이벤트 리스너 정리
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  return (
    <div className="security-report-container h-screen w-screen flex bg-gradient-to-b from-blue-200 to-blue-100">
      
      {/* 사이드바 영역 */}
      {/* show 상태에 따라 표시 여부 결정 */}
      {sidebar && (
        <div 
          className="flex-none transition-width duration-300 ease-in-out" 
          style={{ width: `${sidebarWidth}px` }}
        >
          {/* Sidebar 컴포넌트 - `show` prop을 true로 고정 */}
          <Sidebar show={true} />
        </div>
      )}

      {/* 리사이즈 핸들 */}
      {sidebar && (
        <div
          className="w-2 cursor-ew-resize hover:bg-gray-400 bg-gray-300 transition-colors"
          onMouseDown={startResizing}
        ></div>
      )}

      {/* 메인 컨텐츠 영역 */}
      <div className="main-content flex flex-grow h-full justify-center items-center">
        <div className={`flex flex-col w-full h-full bg-white rounded-lg shadow-lg`}>
          {/* 상단 헤더 바 */}
          <div className="header-top-bar flex-none flex items-center justify-between p-4 border-b border-gray-200">
            <span className="close-icon text-gray-400 text-xl font-bold cursor-pointer" onClick={() => setSidebar(!sidebar)}>☰</span>
            <h1 className="header-title flex-grow text-center text-xl font-bold text-gray-800">증권신고서</h1>
            <div className="flex items-center space-x-4">
              <select className="w-[120px] p-1 border border-gray-300 rounded text-gray-700 text-sm">
                <option>현재버전</option>
              </select>
              <button className="modify-button px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50">수정하기</button>
            </div>
          </div>

          {/* 주요 폼 컨텐츠 영역 */}
          <div className="flex flex-grow overflow-y-auto">
            <div className="w-full bg-white flex flex-col p-8">
              <div className="report-title-section text-center mb-12 mt-8">
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
      </div>
    </div>
  );
};

export default EditPage;
