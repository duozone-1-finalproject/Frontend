// HTML 스트리밍을 위한 유틸리티 함수들
export function createSecuritiesDocumentHTML(): string {
  return `
    <div style="text-align: center; margin-bottom: 2rem;">
      <h2 style="font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem;">증권신고서</h2>
      <div style="font-size: 1.125rem; margin-bottom: 0.5rem;">[회사명]</div>
      <div style="font-size: 1rem;">주식회사 [회사명]</div>
    </div>
    <hr style="border-top: 2px solid #d1d5db; margin: 2rem 0;" />
    <div>
      <h3 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 1rem; color: #2563eb; border-left: 4px solid #2563eb; padding-left: 0.75rem;">
        I. 회사의 개요
      </h3>
      <div style="margin-bottom: 1.5rem;">
        <h4 style="font-weight: 500; margin-bottom: 1rem;">1. 회사의 개황</h4>
        <div style="margin-bottom: 1rem;">
          <div style="display: flex; align-items: center; margin-bottom: 1rem;">
            <div style="width: 8rem; font-size: 0.875rem; font-weight: 500;">회사명</div>
            <div style="flex: 1; color: #6b7280; font-style: italic;">[회사명을 입력하세요]</div>
          </div>
          <div style="display: flex; align-items: center; margin-bottom: 1rem;">
            <div style="width: 8rem; font-size: 0.875rem; font-weight: 500;">설립일자</div>
            <div style="flex: 1; color: #6b7280; font-style: italic;">[설립일자를 입력하세요]</div>
          </div>
          <div style="display: flex; align-items: center; margin-bottom: 1rem;">
            <div style="width: 8rem; font-size: 0.875rem; font-weight: 500;">본점소재지</div>
            <div style="flex: 1; color: #6b7280; font-style: italic;">[본점소재지를 입력하세요]</div>
          </div>
          <div style="display: flex; align-items: center; margin-bottom: 1rem;">
            <div style="width: 8rem; font-size: 0.875rem; font-weight: 500;">대표이사</div>
            <div style="flex: 1; color: #6b7280; font-style: italic;">[대표이사명을 입력하세요]</div>
          </div>
        </div>
      </div>
      <div style="margin-bottom: 1.5rem;">
        <h4 style="font-weight: 500; margin-bottom: 1rem;">2. 사업의 내용</h4>
        <div style="margin-bottom: 1rem;">
          <p style="margin-bottom: 0.5rem;">본 회사는 다음과 같은 사업을 영위하고 있습니다:</p>
          <ul style="margin-left: 1.5rem; margin-bottom: 1rem;">
            <li style="margin-bottom: 0.25rem;">주요 사업 분야: <span style="color: #6b7280; font-style: italic;">[사업 분야를 입력하세요]</span></li>
            <li style="margin-bottom: 0.25rem;">제품 및 서비스: <span style="color: #6b7280; font-style: italic;">[제품/서비스를 입력하세요]</span></li>
            <li style="margin-bottom: 0.25rem;">시장 현황 및 전망: <span style="color: #6b7280; font-style: italic;">[시장 현황을 입력하세요]</span></li>
          </ul>
        </div>
      </div>
      <div style="margin-bottom: 1.5rem;">
        <h4 style="font-weight: 500; margin-bottom: 1rem;">3. 재무 현황</h4>
        <div style="margin-bottom: 1rem;">
          <p style="margin-bottom: 0.5rem;">최근 3개년 재무 현황을 다음과 같이 요약합니다:</p>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 1rem;">
            <thead>
              <tr style="background-color: #f8fafc;">
                <th style="border: 1px solid #e2e8f0; padding: 0.5rem; text-align: left; font-weight: 500;">구분</th>
                <th style="border: 1px solid #e2e8f0; padding: 0.5rem; text-align: right; font-weight: 500;">2023년</th>
                <th style="border: 1px solid #e2e8f0; padding: 0.5rem; text-align: right; font-weight: 500;">2022년</th>
                <th style="border: 1px solid #e2e8f0; padding: 0.5rem; text-align: right; font-weight: 500;">2021년</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="border: 1px solid #e2e8f0; padding: 0.5rem;">매출액</td>
                <td style="border: 1px solid #e2e8f0; padding: 0.5rem; text-align: right; color: #6b7280; font-style: italic;">[금액 입력]</td>
                <td style="border: 1px solid #e2e8f0; padding: 0.5rem; text-align: right; color: #6b7280; font-style: italic;">[금액 입력]</td>
                <td style="border: 1px solid #e2e8f0; padding: 0.5rem; text-align: right; color: #6b7280; font-style: italic;">[금액 입력]</td>
              </tr>
              <tr>
                <td style="border: 1px solid #e2e8f0; padding: 0.5rem;">영업이익</td>
                <td style="border: 1px solid #e2e8f0; padding: 0.5rem; text-align: right; color: #6b7280; font-style: italic;">[금액 입력]</td>
                <td style="border: 1px solid #e2e8f0; padding: 0.5rem; text-align: right; color: #6b7280; font-style: italic;">[금액 입력]</td>
                <td style="border: 1px solid #e2e8f0; padding: 0.5rem; text-align: right; color: #6b7280; font-style: italic;">[금액 입력]</td>
              </tr>
              <tr>
                <td style="border: 1px solid #e2e8f0; padding: 0.5rem;">당기순이익</td>
                <td style="border: 1px solid #e2e8f0; padding: 0.5rem; text-align: right; color: #6b7280; font-style: italic;">[금액 입력]</td>
                <td style="border: 1px solid #e2e8f0; padding: 0.5rem; text-align: right; color: #6b7280; font-style: italic;">[금액 입력]</td>
                <td style="border: 1px solid #e2e8f0; padding: 0.5rem; text-align: right; color: #6b7280; font-style: italic;">[금액 입력]</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div style="margin-bottom: 1.5rem;">
        <h4 style="font-weight: 500; margin-bottom: 1rem;">4. 주요 주주 현황</h4>
        <div style="margin-bottom: 1rem;">
          <p style="margin-bottom: 0.5rem;">본 회사의 주요 주주 현황은 다음과 같습니다:</p>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 1rem;">
            <thead>
              <tr style="background-color: #f8fafc;">
                <th style="border: 1px solid #e2e8f0; padding: 0.5rem; text-align: left; font-weight: 500;">주주명</th>
                <th style="border: 1px solid #e2e8f0; padding: 0.5rem; text-align: right; font-weight: 500;">보유주식수</th>
                <th style="border: 1px solid #e2e8f0; padding: 0.5rem; text-align: right; font-weight: 500;">지분율(%)</th>
                <th style="border: 1px solid #e2e8f0; padding: 0.5rem; text-align: center; font-weight: 500;">비고</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="border: 1px solid #e2e8f0; padding: 0.5rem; color: #6b7280; font-style: italic;">[주주명 입력]</td>
                <td style="border: 1px solid #e2e8f0; padding: 0.5rem; text-align: right; color: #6b7280; font-style: italic;">[주식수 입력]</td>
                <td style="border: 1px solid #e2e8f0; padding: 0.5rem; text-align: right; color: #6b7280; font-style: italic;">[지분율 입력]</td>
                <td style="border: 1px solid #e2e8f0; padding: 0.5rem; text-align: center; color: #6b7280; font-style: italic;">[비고 입력]</td>
              </tr>
              <tr>
                <td style="border: 1px solid #e2e8f0; padding: 0.5rem; color: #6b7280; font-style: italic;">[주주명 입력]</td>
                <td style="border: 1px solid #e2e8f0; padding: 0.5rem; text-align: right; color: #6b7280; font-style: italic;">[주식수 입력]</td>
                <td style="border: 1px solid #e2e8f0; padding: 0.5rem; text-align: right; color: #6b7280; font-style: italic;">[지분율 입력]</td>
                <td style="border: 1px solid #e2e8f0; padding: 0.5rem; text-align: center; color: #6b7280; font-style: italic;">[비고 입력]</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
}

// HTML을 청크 단위로 분할하는 함수 (더 세밀한 분할)
export function splitHTMLIntoChunks(html: string, chunkSize = 25): string[] {
  const chunks: string[] = []
  let currentChunk = ""
  let inTag = false
  let tagBuffer = ""
  let charCount = 0

  for (let i = 0; i < html.length; i++) {
    const char = html[i]

    if (char === "<") {
      inTag = true
      tagBuffer = char
    } else if (char === ">" && inTag) {
      inTag = false
      tagBuffer += char
      currentChunk += tagBuffer
      tagBuffer = ""
    } else if (inTag) {
      tagBuffer += char
    } else {
      currentChunk += char
      charCount++

      // 청크 크기에 도달하면 새로운 청크 시작 (태그 내부가 아닐 때만)
      if (charCount >= chunkSize && !inTag) {
        chunks.push(currentChunk)
        currentChunk = ""
        charCount = 0
      }
    }
  }

  // 남은 내용이 있으면 마지막 청크에 추가
  if (currentChunk.length > 0 || tagBuffer.length > 0) {
    chunks.push(currentChunk + tagBuffer)
  }

  return chunks
}
