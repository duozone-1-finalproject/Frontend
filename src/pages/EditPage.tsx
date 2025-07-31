// LoginPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios'; 
import Sidebar from '../components/Sidebar';

const EditPage = () => {
  const navigate = useNavigate();
  const [sidebar,setSidebar]= useState<boolean>(true);

  return (
    // 가장 바깥쪽 컨테이너: 화면 전체를 채우도록 설정 (h-screen, w-screen)
    // 배경 그라디언트 유지, flex 컨테이너로 설정
    // items-center, justify-center는 제거하여 내부 컨텐츠가 중앙에 모이지 않도록 함
    // 가장 바깥쪽 컨테이너: 화면 전체를 채우고, Sidebar와 메인 컨텐츠 블록을 수직 중앙에 정렬
        // justify-center는 제거하여 main-content가 flex-grow로 남은 공간을 채우게 합니다.
        <div className="security-report-container h-screen w-screen flex items-center bg-gradient-to-b from-blue-200 to-blue-100">

            {/* Sidebar 컴포넌트 */}
            {/* Sidebar 컴포넌트 내부에서 너비(flexBasis)와 축소 방지(flexShrink)를 정의한다고 가정합니다. */}
            <Sidebar show={sidebar} />

            {/* 메인 컨텐츠 영역 (흰색 배경의 큰 카드 형태) */}
            {/* flex-grow: Sidebar 옆의 남은 공간을 모두 차지합니다. */}
            {/* h-full: 부모의 높이를 100% 채웁니다. */}
            {/* max-w-full: main-content 자체는 부모의 최대 너비를 따릅니다. */}
            {/* justify-center items-center: 내부 실제 폼 영역을 이 main-content 중앙에 정렬합니다. */}
            <div className="main-content flex flex-grow h-full max-w-full justify-center items-center">
                {/*
                    실제 폼과 우측 빈 공간을 감싸는 래퍼 div (이미지에서 보이는 흰색 박스):
                    - flex flex-col: 상단 헤더와 하단 폼 영역을 세로로 배치합니다.
                    - w-full h-full: main-content 내에서 사용 가능한 공간을 최대한 채웁니다.
                    - max-w-[80vw]: 폼 영역 전체의 최대 가로 크기를 뷰포트 너비의 80%로 제한합니다.
                    - bg-white rounded-lg shadow-lg: 전체 폼 영역에 흰색 배경, 둥근 모서리, 그림자를 적용.
                */}
                <div className={`flex flex-col w-full h-full ${sidebar? "max-w-80vw":"max-w-vw"} bg-white rounded-lg shadow-lg`}>
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
            </div>
        </div>
  );
};

export default EditPage;