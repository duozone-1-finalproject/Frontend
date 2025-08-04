// 실제 증권신고서 데이터 (지금은 더미데이터)
export function generateSecuritiesReportTemplate(): string {
  // 기존 템플릿 함수 내용 그대로
  return `
    <div class="securities-report">
      <header class="report-header">
        <h1>증권신고서</h1>
        <div class="company-info">
          <h2>[회사명]</h2>
          <p>주식회사 [회사명]</p>
        </div>
      </header>

      <section class="report-section">
        <h3>I. 회사의 개요</h3>
        <div class="subsection">
          <h4>1. 회사의 개황</h4>
          <table class="info-table">
            <tr>
              <td>회사명</td>
              <td>[회사명을 입력하세요]</td>
            </tr>
            <tr>
              <td>설립일자</td>
              <td>[설립일자를 입력하세요]</td>
            </tr>
            <tr>
              <td>본점소재지</td>
              <td>[본점소재지를 입력하세요]</td>
            </tr>
            <tr>
              <td>대표이사</td>
              <td>[대표이사명을 입력하세요]</td>
            </tr>
          </table>
        </div>
      </section>

      <section class="report-section">
        <h3>II. 사업의 내용</h3>
        <div class="subsection">
          <h4>1. 사업의 개요</h4>
          <p>[사업의 개요를 입력하세요]</p>
        </div>
        <div class="subsection">
          <h4>2. 주요 제품 및 서비스</h4>
          <p>[주요 제품 및 서비스를 입력하세요]</p>
        </div>
      </section>

      <section class="report-section">
        <h3>III. 재무에 관한 사항</h3>
        <div class="subsection">
          <h4>1. 요약재무정보</h4>
          <table class="financial-table">
            <thead>
              <tr>
                <th>구분</th>
                <th>2023년</th>
                <th>2022년</th>
                <th>2021년</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>매출액</td>
                <td>[금액 입력]</td>
                <td>[금액 입력]</td>
                <td>[금액 입력]</td>
              </tr>
              <tr>
                <td>영업이익</td>
                <td>[금액 입력]</td>
                <td>[금액 입력]</td>
                <td>[금액 입력]</td>
              </tr>
              <tr>
                <td>당기순이익</td>
                <td>[금액 입력]</td>
                <td>[금액 입력]</td>
                <td>[금액 입력]</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="report-section">
        <h3>IV. 이사의 경영진단 및 분석의견</h3>
        <p>[경영진단 및 분석의견을 입력하세요]</p>
      </section>

      <section class="report-section">
        <h3>V. 회계감사인의 감사의견 등</h3>
        <p>[감사의견을 입력하세요]</p>
      </section>
    </div>

    <style>
      .securities-report {
        max-width: 800px;
        margin: 0 auto;
        padding: 40px;
        font-family: 'Malgun Gothic', sans-serif;
        line-height: 1.6;
        color: #333;
      }
      
      .report-header {
        text-align: center;
        margin-bottom: 40px;
        padding-bottom: 20px;
        border-bottom: 2px solid #333;
      }
      
      .report-header h1 {
        font-size: 28px;
        font-weight: bold;
        margin-bottom: 20px;
      }
      
      .company-info h2 {
        font-size: 20px;
        margin-bottom: 10px;
      }
      
      .report-section {
        margin-bottom: 30px;
      }
      
      .report-section h3 {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 15px;
        color: #2563eb;
        border-left: 4px solid #2563eb;
        padding-left: 10px;
      }
      
      .subsection {
        margin-bottom: 20px;
        margin-left: 20px;
      }
      
      .subsection h4 {
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 10px;
      }
      
      .info-table, .financial-table {
        width: 100%;
        border-collapse: collapse;
        margin: 15px 0;
      }
      
      .info-table td, .financial-table th, .financial-table td {
        border: 1px solid #ddd;
        padding: 8px 12px;
        text-align: left;
      }
      
      .info-table td:first-child, .financial-table th {
        background-color: #f8f9fa;
        font-weight: bold;
      }
      
      .financial-table th {
        background-color: #2563eb;
        color: white;
        text-align: center;
      }
      
      .financial-table td {
        text-align: right;
      }
      
      .financial-table td:first-child {
        text-align: left;
      }
    </style>
  `
}