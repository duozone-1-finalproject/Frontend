export const getInitialDocumentHTML = () => {
  return `<div class="document-header">
    <h1 class="document-title">증권신고서</h1>
    <div class="company-info">
      <div class="company-placeholder">[회사명]</div>
      <div class="company-name">주식회사 [회사명]</div>
    </div>
  </div>

  <hr class="document-divider" />

  <div class="document-body">
    <h2 class="section-title">I. 회사의 개요</h2>

    <div class="subsection">
      <h3 class="subsection-title">1. 회사의 개황</h3>

      <div class="info-table">
        <div class="info-row">
          <div class="info-label">회사명</div>
          <div class="info-value">[회사명을 입력하세요]</div>
        </div>
        <div class="info-row">
          <div class="info-label">설립일자</div>
          <div class="info-value">[설립일자를 입력하세요]</div>
        </div>
        <div class="info-row">
          <div class="info-label">본점소재지</div>
          <div class="info-value">[본점소재지를 입력하세요]</div>
        </div>
        <div class="info-row">
          <div class="info-label">대표이사</div>
          <div class="info-value">[대표이사명을 입력하세요]</div>
        </div>
      </div>
    </div>

    <div class="subsection">
      <h3 class="subsection-title">2. 사업의 내용</h3>
      <div class="content-text">
        <p>본 회사는 다음과 같은 사업을 영위하고 있습니다:</p>
        <ul class="content-list">
          <li>주요 사업 분야</li>
          <li>제품 및 서비스</li>
          <li>시장 현황 및 전망</li>
        </ul>
      </div>
    </div>

    <div class="subsection">
      <h3 class="subsection-title">3. 재무 현황</h3>
      <div class="content-text">
        <p>최근 3개년 재무 현황을 다음과 같이 요약합니다:</p>
        <ul class="content-list">
          <li>매출액 현황</li>
          <li>영업이익 현황</li>
          <li>당기순이익 현황</li>
        </ul>
      </div>
    </div>

    <div class="subsection">
      <h3 class="subsection-title">4. 주요 주주 현황</h3>
      <div class="content-text">
        <p>본 회사의 주요 주주 현황은 다음과 같습니다:</p>
        <ul class="content-list">
          <li>대주주 현황</li>
          <li>지분율 현황</li>
          <li>특수관계인 현황</li>
        </ul>
      </div>
    </div>
  </div>`
}

export const getStreamingContent = () => {
  return `증권신고서

[회사명]
주식회사 [회사명]

I. 회사의 개요

1. 회사의 개황

회사명                    [회사명을 입력하세요]
설립일자                  [설립일자를 입력하세요]
본점소재지                [본점소재지를 입력하세요]
대표이사                  [대표이사명을 입력하세요]

2. 사업의 내용

본 회사는 다음과 같은 사업을 영위하고 있습니다:
- 주요 사업 분야
- 제품 및 서비스
- 시장 현황 및 전망

3. 재무 현황

최근 3개년 재무 현황을 다음과 같이 요약합니다:
- 매출액 현황
- 영업이익 현황
- 당기순이익 현황

4. 주요 주주 현황

본 회사의 주요 주주 현황은 다음과 같습니다:
- 대주주 현황
- 지분율 현황
- 특수관계인 현황`
}
