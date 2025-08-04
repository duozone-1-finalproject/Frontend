// src/pages/MainPage.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

// 사용자 정보 DTO 인터페이스 (백엔드 UserDto.java에 맞춰 정의)
interface UserDto {
  username: string;
  email: string;
  role: string;
  name?: string; // name 필드 추가, 백엔드 User.java에 name 필드 있음
}

const MainPage = () => {
  const navigate = useNavigate();
  const [showMyPageBar, setShowMyPageBar] = useState(false); // 마이페이지 바 표시 여부
  const [showSideBar, setShowSideBar] = useState(false);     // 사이드바 표시 여부
  const [currentUser, setCurrentUser] = useState<UserDto | null>(null); // 현재 사용자 정보

  // JWT 검증 및 사용자 정보 가져오기
  useEffect(() => {
    const checkTokenAndFetchUser = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        navigate("/"); // 로그인 페이지로 리디렉션
        return;
      }

      try {
        const res = await axios.get<UserDto>("/users/me"); // UserDto 타입 명시
        console.log("✅ 사용자 정보 확인:", res.data);
        setCurrentUser(res.data); // 사용자 정보 저장
      } catch (err) {
        console.warn("❌ 인증 실패:", err);
        localStorage.removeItem("accessToken"); // 유효하지 않은 토큰 제거
        navigate("/"); // 로그인 페이지로 리디렉션
      }
    };

    checkTokenAndFetchUser();
  }, [navigate]);

  // 프로필 아이콘 클릭 핸들러 (마이페이지 바 토글)
  const handleProfileClick = () => {
    setShowMyPageBar((prev) => !prev);
    setShowSideBar(false); 
  };

  // 메뉴 아이콘 클릭 핸들러 (사이드바 토글)
  const handleMenuClick = () => {
    setShowSideBar((prev) => !prev);
    
  };

  // 마이페이지 버튼 클릭 핸들러
  const handleMyPageButtonClick = () => {
    navigate("/mypage"); 
    setShowMyPageBar(false); 
  };

  // 보고서 생성 챗봇 클릭 핸들러
  const handleChatbotClick = () => {
    navigate("/chatbot"); 
    setShowSideBar(false); 
  };

  const handleEditClick = () => {
    navigate("/edit");
    setShowSideBar(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white overflow-hidden">
      {/* 상단 네비게이션 */}
      <div className="w-full flex justify-between items-center px-6 py-4 border-b relative z-10">
        <div className="flex items-end space-x-2">
          <h1 className="text-3xl font-extrabold text-black">keommaeng</h1>
          <span className="text-sm text-gray-500">보고서 생성</span>
        </div>
        <div className="flex space-x-4">
          {/* 메뉴 아이콘과 프로필 아이콘 순서 변경 */}
          <img
            src="/img/menu_icon.png"
            alt="Menu"
            className="w-6 h-6 cursor-pointer"
            onClick={handleMenuClick}
          />
          <img
            src="/img/profil_icon.png"
            alt="Profile"
            className="w-6 h-6 cursor-pointer"
            onClick={handleProfileClick}
          />
        </div>

        {/* 마이페이지 바 (조건부 렌더링) */}
        {showMyPageBar && (
          <div
            className="absolute right-4 top-20 w-96 bg-white shadow-lg rounded-lg flex flex-col z-20"

          >
            <img
              className="w-full h-48 object-cover rounded-t-lg" 
              src="img\profil.jpg" 
              alt="Profile background"
            />
            <div className="p-4 flex items-center gap-4">
              <img
                className="w-10 h-10 rounded-full bg-gray-300" 
                src="\img\my_profil.jpg" 
              />
              <div className="flex-1 flex flex-col">
                <div className="text-black text-xl font-medium leading-7">
                  {currentUser?.name || currentUser?.username || "김이박"}
                </div>
                <div className="text-gray-600 text-sm font-normal leading-5">
                  {currentUser?.email || "회계팀"}
                </div>
              </div>
            </div>
            <div className="px-4 py-4 flex flex-col gap-4">
              <div className="text-transparent h-0"></div>
            </div>
            <div className="p-2 pr-3 flex justify-start items-center gap-6 border-t border-gray-200">
              <div className="flex-1 flex justify-start items-center gap-2">
                <button
                  className="h-9 min-w-16 px-2 py-1.5 rounded flex justify-center items-center gap-2 hover:bg-purple-50 transition-colors"
                  onClick={handleMyPageButtonClick}
                >
                  <div className="text-center text-[#6200E8] text-sm font-medium uppercase leading-6 tracking-wide">
                    mypage
                  </div>
                </button>
                <button
                  className="h-9 min-w-16 px-2 py-1.5 rounded flex justify-center items-center gap-2 hover:bg-purple-50 transition-colors"
                >
                  <div className="text-center text-[#6200E8] text-sm font-medium uppercase leading-6 tracking-wide">
                    Button
                  </div>
                </button>
              </div>
              <div className="flex justify-start items-center gap-6">
                  <button className="w-6 h-6 flex items-center justify-center" onClick={() => console.log('Fav clicked')}>
                  </button>
                  <img
                    src="/img/3menu_icon.png"
                    alt="더보기"
                    className="w-6 h-6 cursor-pointer"
                    onClick={() => console.log('More options clicked')}
                  />
                </div>
            </div>
          </div>
        )}

        {/* 사이드바 (조건부 렌더링) */}
        {showSideBar && (
          <div
            className="absolute left-4 top-20 w-56 bg-white shadow-lg rounded-r-lg flex flex-col z-20">
            <div className="p-4 flex flex-col">
              <div className="text-black text-xl font-medium leading-7">
                keommaeng
              </div>
              <div className="text-gray-600 text-xs font-normal leading-4">
                보고서 생성
              </div>
            </div>
            <div className="py-2 flex flex-col">
              <div
                className="relative h-12 flex items-center cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={handleChatbotClick}>
                <div
                  className="absolute inset-y-1 left-1.5 w-[calc(100%-1.5rem)] h-10 rounded" 
                  style={{ background: "rgba(98, 0, 232, 0.12)" }}
                ></div>
                <div className="relative flex items-center w-full h-full"> 
                  <div className="w-6 h-6 ml-4 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs">AI</div>
                  <div className="ml-4 text-[#6200E8] text-sm font-normal leading-5">
                    보고서 생성 챗봇
                  </div>
                </div>
              </div>
              {/* 추가 메뉴 아이템이 있다면 여기 추가할 예정 */}
              <div className="h-12 flex items-center cursor-pointer hover:bg-gray-100 transition-colors">
              </div>
            </div>
            <div className="w-full h-px my-2 bg-gray-200"></div> {}
            <div className="w-full h-px bg-gray-200"></div> {}
          </div>
        )}
      </div>

      {/* 배경 이미지 */}
      <div className="w-full">
        <img
          src="/img/main_cat.jpg"
          alt="배경"
          className="w-full max-h-[600px] object-cover"
        />
      </div>

      {/* 타이틀 */}
      <div className="px-7 py-6 border-b">
        <h2 className="text-2xl font-bold text-black">
          증권신고서 <span className="text-lg text-gray-700">| 발행공시</span>
        </h2>
      </div>

      {/* 버튼 영역 */}
      <div className="w-full">
        {["지분증권", "채무증권", "증권예약", "투자예약"].map((text, idx) => {
          let bgColor = "";
          let hoverBgColor = "";
          let textColor = "text-black";

          if (idx === 0) {
            bgColor = "bg-[#EDE6E6]"; // 지분증권
            hoverBgColor = "hover:bg-[#E0D9D9]";
          } else if (idx === 1) {
            bgColor = "bg-[#D5CBCB]"; // 채무증권
            hoverBgColor = "hover:bg-[#C8BFBF]";
          } else if (idx === 2) {
            bgColor = "bg-[#A4A0A0]"; // 증권예약
            hoverBgColor = "hover:bg-[#979393]";
          } else {
            bgColor = "bg-[#706E6E]"; // 투자예약
            hoverBgColor = "hover:bg-[#636161]";
          }

          return (
            <button
              key={text}
              className={`
                w-full text-left px-6 py-8 text-lg font-semibold border-b
                transition-colors duration-200 ease-in-out
                ${bgColor}
                ${textColor}
                ${hoverBgColor}
              `}
              onClick={handleChatbotClick}
            >
              {text}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MainPage;