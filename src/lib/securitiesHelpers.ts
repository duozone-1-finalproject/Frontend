// Securities 도메인 전용 헬퍼 함수들

// 숫자 포매팅 (한국어 천단위 구분)
export const formatNumber = (value: any): string => {
  if (!value) return "";
  const num = Number(value);
  if (isNaN(num)) return value;
  return num.toLocaleString("ko-KR");
};

// 날짜 포매팅 (YYYY-MM-DD → YYYY년 M월 D일)
export const formatDate = (dateStr: string | null): string => {
  if (!dateStr || dateStr === null) return "-";
  
  if (dateStr.includes("년")) return dateStr;
  
  const match = dateStr.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (match) {
    const [, year, month, day] = match;
    return `${year}년 ${parseInt(month, 10)}월 ${parseInt(day, 10)}일`;
  }
  
  return dateStr;
};

// Securities 도메인 기본 주석 텍스트
export const getDefaultNote = (index: number): string => {
  const defaultNotes: { [key: number]: string } = {
    1: "모집(매출) 예정가액과 관련된 내용은「제1부 모집 또는 매출에 관한 사항」- 「Ⅳ. 인수인의 의견(분석기관의 의견)」의 「4. 공모가격에 대한 의견」부분을 참조하시기 바랍니다.",
    2: "모집(매출)가액, 모집(매출)총액, 인수금액 및 인수대가는 발행회사와 대표주관회사가 협의하여 제시하는 공모희망가액 기준입니다.",
    3: "모집(매출)가액의 확정은 청약일 전에 실시하는 수요예측 결과를 반영하여 대표주관회사와 발행회사가 협의하여 최종 결정할 예정입니다.",
    4: "증권의 발행 및 공시 등에 관한 규정에 따라 정정신고서 상의 공모주식수는 증권신고서의 공모할 주식수의 80% 이상 120% 이하로 변경가능합니다.",
    5: "투자 위험 등 자세한 내용은 투자설명서를 참조하시기 바라며, 투자결정시 신중하게 검토하시기 바랍니다."
  };
  return defaultNotes[index] || "주석 내용을 불러오는 중입니다...";
};



// 투자위험요소 문단 분리 함수
export function splitTextIntoParagraphs(text: string | null | undefined): string[] {
  // 입력값이 null이거나 undefined, 혹은 빈 문자열이면 빈 배열을 반환합니다.
  if (!text) {
    return [];
  }

  return text
    .split('\n\n') // '\n\n'을 기준으로 문자열을 나눕니다.
    .map(paragraph => paragraph.trim()) // 각 문단의 앞뒤에 있는 불필요한 공백을 제거합니다.
    .filter(paragraph => paragraph.length > 0); // 내용이 없는 빈 문단을 배열에서 제거합니다.
};

export const getCurrentDateVariables = () => {
  const now = new Date();
  return {
    S1_1A_1: now.getFullYear().toString(),           // 2025
    S1_1A_2: String(now.getMonth() + 1).padStart(2, '0'),  // 09
    S1_1A_3: String(now.getDate()).padStart(2, '0')        // 12
  };
};

