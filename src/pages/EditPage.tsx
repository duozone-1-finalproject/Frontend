// LoginPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios'; 
import Sidebar from '../components/sidebar';

const EditPage = () => {
  const navigate = useNavigate();

  return (
    // 가장 바깥쪽 컨테이너: 화면 전체를 채우도록 설정 (h-screen, w-screen)
    // 배경 그라디언트 유지, flex 컨테이너로 설정
    // items-center, justify-center는 제거하여 내부 컨텐츠가 중앙에 모이지 않도록 함
    <div className="security-report-container h-screen w-screen flex items-center justify-center bg-gradient-to-b from-blue-200 to-blue-100">
      {/* Sidebar 컴포넌트 (show prop은 예시) */}
      {/* Sidebar의 실제 너비는 Sidebar 컴포넌트 내부나 여기에 Tailwind 클래스로 지정해야 합니다. */}
      {/* 예: w-64 또는 w-1/5 */}
      {/* 여기서는 Sidebar가 고정 너비를 가진다고 가정하고, flex-shrink-0 (축소 방지)을 추가할 수 있습니다. */}
      {/* 실제 Sidebar 컴포넌트가 있다면 해당 컴포넌트 내에서 너비 설정 */}
      {/* 임시로 Sidebar를 div로 대체합니다. */}
      <Sidebar show={true}></Sidebar>


      {/* 메인 컨텐츠 영역: 남은 공간을 모두 채우도록 flex-grow, h-full, w-full, max-w-full 설정 */}
      {/* 그림자 및 둥근 모서리 유지 */}
      <div className="main-content flex flex-grow w-full h-full max-w-full rounded-lg shadow-lg overflow-hidden">
        {/* 좌측 (2/5) 영역 */}
        <div className="w-full bg-white flex flex-col p-8"> {/* 흰색 배경으로 변경, 내부 컨텐츠를 위한 flex-col */}
          <div className="header-bar flex justify-between items-center pb-4 border-b border-gray-200 mb-8">
            <span className="close-icon text-gray-400 text-xl font-bold cursor-pointer">X</span>
            <h1 className="header-title text-xl font-bold text-gray-800">증권신고서</h1>
            <button className="modify-button px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50">수정하기</button>
          </div>

          <div className="report-title-section text-center mb-12">
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
  );
};

export default EditPage;