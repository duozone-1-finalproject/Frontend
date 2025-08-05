// src/services/mockDataService.ts

// 보고서 데이터 타입 정의
export interface ReportFormData {
  id: number;
  title: string;
  subtitle: string;
  recipient: string;
  date: {
    year: string;
    month: string;
    day: string;
  };
  companyName: string;
  ceoName: string;
  address: string;
  responsiblePerson: string;
  securitiesInfo: string;
  content: string; // HTML 콘텐츠
  createdAt: string;
  updatedAt: string;
}

// 더미 보고서 데이터들 (AI가 생성했다고 가정)
const INITIAL_REPORTS: ReportFormData[] = [
  {
    id: 999,
    title: '증권신고서',
    subtitle: '( 지 분 증 권 )',
    recipient: '금융위원회 귀중',
    date: { year: '2024', month: '12', day: '15' },
    companyName: '테크노바 주식회사',
    ceoName: '김기술',
    address: '서울특별시 강남구 테헤란로 123',
    responsiblePerson: '이재무 (재무담당임원)',
    securitiesInfo: '보통주 1,000,000주 (액면가액 500원)',
    createdAt: '2024-12-15T09:00:00Z',
    updatedAt: '2024-12-15T09:00:00Z',
    content: `
      <h1>증권신고서</h1>
      <h2>( 지 분 증 권 )</h2>
      <br>
      <p><strong>금융위원회 귀중</strong></p>
      <p style="text-align: right;">2024년 12월 15일</p>
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
      <p><strong>아래 내용은 AI가 생성한 보고서 본문 내용입니다.</strong></p>
      <p>본 신고서는 '테크노바 주식회사'가 발행하는 증권에 대한 정보를 담고 있습니다. 해당 증권은 보통주 1,000,000주이며, 액면가액은 500원입니다.</p>
      <ul>
        <li>신고서 제출일: 2024년 12월 15일</li>
        <li>대표이사: 김기술</li>
        <li>작성 책임자: 이재무</li>
      </ul>
      <p>이 문서는 투자자 보호를 위해 중요한 정보를 포함하고 있습니다. 모든 내용은 신뢰할 수 있는 정보를 바탕으로 작성되었지만, 투자 결정은 개인의 판단에 따라 신중하게 이루어져야 합니다.</p>
      <p>본문 내용 편집 시 위의 기본 양식을 참고하여 수정하시거나, '현재 보고서 양식 불러오기' 버튼을 클릭하여 처음부터 다시 양식을 불러올 수 있습니다.</p>
    `,
  },
];

// 로컬 스토리지에 데이터 저장/로드
const saveReports = (reports: ReportFormData[]) => {
  localStorage.setItem('reports', JSON.stringify(reports));
};

const loadReports = (): ReportFormData[] => {
  const stored = localStorage.getItem('reports');
  if (stored) {
    return JSON.parse(stored);
  }
  saveReports(INITIAL_REPORTS);
  return INITIAL_REPORTS;
};

// API 서비스 객체 정의
export const MockDataService = {
  // 모든 보고서 가져오기
  async getReports(): Promise<ReportFormData[]> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return loadReports();
  },

  // ID로 특정 보고서 가져오기
  async getReportById(id: number): Promise<ReportFormData | undefined> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const reports = loadReports();
    return reports.find((report) => report.id === id);
  },

  // 보고서 업데이트
  async updateReport(updatedReport: ReportFormData): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const reports = loadReports();
    const index = reports.findIndex((report) => report.id === updatedReport.id);

    if (index === -1) {
      console.error(`Error: Report with ID ${updatedReport.id} not found.`);
      return false;
    }

    reports[index] = updatedReport;
    saveReports(reports);
    return true;
  },
};