export interface DocumentTemplate {
  id: string
  name: string
  description: string
  category: string
  previewImage?: string
  features: string[]
  htmlContent: () => string
}

export const documentTemplates: DocumentTemplate[] = [
  {
    id: "basic-securities",
    name: "기본 증권신고서",
    description: "일반적인 증권신고서 양식으로 기본적인 회사 정보와 재무 현황을 포함합니다.",
    category: "일반",
    features: ["회사 개요", "사업 내용", "재무 현황", "주주 현황"],
    htmlContent: () => `
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
      </div>
    `,
  },
  {
    id: "ipo-securities",
    name: "IPO 증권신고서",
    description: "기업공개(IPO)를 위한 상세한 증권신고서 양식입니다. 투자자 정보와 공모 계획이 포함됩니다.",
    category: "IPO",
    features: ["회사 개요", "공모 계획", "투자 위험 요소", "재무 정보", "경영진 정보"],
    htmlContent: () => `
      <div style="text-align: center; margin-bottom: 2rem;">
        <h2 style="font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem; color: #dc2626;">IPO 증권신고서</h2>
        <div style="font-size: 1.125rem; margin-bottom: 0.5rem;">[회사명]</div>
        <div style="font-size: 1rem;">주식회사 [회사명]</div>
        <div style="font-size: 0.875rem; color: #6b7280; margin-top: 1rem;">기업공개용</div>
      </div>
      <hr style="border-top: 2px solid #dc2626; margin: 2rem 0;" />
      <div>
        <h3 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 1rem; color: #dc2626; border-left: 4px solid #dc2626; padding-left: 0.75rem;">
          I. 공모 개요
        </h3>
        <div style="margin-bottom: 1.5rem;">
          <h4 style="font-weight: 500; margin-bottom: 1rem;">1. 공모 정보</h4>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 1rem;">
            <tbody>
              <tr>
                <td style="border: 1px solid #e2e8f0; padding: 0.5rem; font-weight: 500; background-color: #f8fafc; width: 30%;">공모주식수</td>
                <td style="border: 1px solid #e2e8f0; padding: 0.5rem; color: #6b7280; font-style: italic;">[공모주식수를 입력하세요]</td>
              </tr>
              <tr>
                <td style="border: 1px solid #e2e8f0; padding: 0.5rem; font-weight: 500; background-color: #f8fafc;">공모가격</td>
                <td style="border: 1px solid #e2e8f0; padding: 0.5rem; color: #6b7280; font-style: italic;">[공모가격을 입력하세요]</td>
              </tr>
              <tr>
                <td style="border: 1px solid #e2e8f0; padding: 0.5rem; font-weight: 500; background-color: #f8fafc;">공모금액</td>
                <td style="border: 1px solid #e2e8f0; padding: 0.5rem; color: #6b7280; font-style: italic;">[공모금액을 입력하세요]</td>
              </tr>
              <tr>
                <td style="border: 1px solid #e2e8f0; padding: 0.5rem; font-weight: 500; background-color: #f8fafc;">상장예정일</td>
                <td style="border: 1px solid #e2e8f0; padding: 0.5rem; color: #6b7280; font-style: italic;">[상장예정일을 입력하세요]</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div style="margin-bottom: 1.5rem;">
          <h4 style="font-weight: 500; margin-bottom: 1rem;">2. 투자 위험 요소</h4>
          <div style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 0.5rem; padding: 1rem; margin-bottom: 1rem;">
            <p style="color: #dc2626; font-weight: 500; margin-bottom: 0.5rem;">⚠️ 투자 위험 고지</p>
            <ul style="margin-left: 1.5rem; color: #7f1d1d;">
              <li style="margin-bottom: 0.25rem;">시장 위험: <span style="color: #6b7280; font-style: italic;">[시장 위험 요소를 입력하세요]</span></li>
              <li style="margin-bottom: 0.25rem;">사업 위험: <span style="color: #6b7280; font-style: italic;">[사업 위험 요소를 입력하세요]</span></li>
              <li style="margin-bottom: 0.25rem;">재무 위험: <span style="color: #6b7280; font-style: italic;">[재무 위험 요소를 입력하세요]</span></li>
            </ul>
          </div>
        </div>
      </div>
    `,
  },
  {
    id: "tech-securities",
    name: "기술기업 증권신고서",
    description: "기술 중심 기업을 위한 특화된 증권신고서입니다. R&D 정보와 기술 경쟁력이 강조됩니다.",
    category: "기술",
    features: ["기술 개요", "R&D 현황", "특허 정보", "기술 경쟁력", "시장 분석"],
    htmlContent: () => `
      <div style="text-align: center; margin-bottom: 2rem;">
        <h2 style="font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem; color: #7c3aed;">기술기업 증권신고서</h2>
        <div style="font-size: 1.125rem; margin-bottom: 0.5rem;">[회사명]</div>
        <div style="font-size: 1rem;">주식회사 [회사명]</div>
        <div style="font-size: 0.875rem; color: #6b7280; margin-top: 1rem;">🚀 Technology Company</div>
      </div>
      <hr style="border-top: 2px solid #7c3aed; margin: 2rem 0;" />
      <div>
        <h3 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 1rem; color: #7c3aed; border-left: 4px solid #7c3aed; padding-left: 0.75rem;">
          I. 기술 및 사업 개요
        </h3>
        <div style="margin-bottom: 1.5rem;">
          <h4 style="font-weight: 500; margin-bottom: 1rem;">1. 핵심 기술</h4>
          <div style="background-color: #f3f4f6; border-radius: 0.5rem; padding: 1rem; margin-bottom: 1rem;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div>
                <div style="font-weight: 500; margin-bottom: 0.5rem;">주력 기술 분야</div>
                <div style="color: #6b7280; font-style: italic;">[주력 기술 분야를 입력하세요]</div>
              </div>
              <div>
                <div style="font-weight: 500; margin-bottom: 0.5rem;">기술 개발 단계</div>
                <div style="color: #6b7280; font-style: italic;">[개발 단계를 입력하세요]</div>
              </div>
            </div>
          </div>
        </div>
        <div style="margin-bottom: 1.5rem;">
          <h4 style="font-weight: 500; margin-bottom: 1rem;">2. R&D 현황</h4>
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
                <td style="border: 1px solid #e2e8f0; padding: 0.5rem;">R&D 투자액</td>
                <td style="border: 1px solid #e2e8f0; padding: 0.5rem; text-align: right; color: #6b7280; font-style: italic;">[금액 입력]</td>
                <td style="border: 1px solid #e2e8f0; padding: 0.5rem; text-align: right; color: #6b7280; font-style: italic;">[금액 입력]</td>
                <td style="border: 1px solid #e2e8f0; padding: 0.5rem; text-align: right; color: #6b7280; font-style: italic;">[금액 입력]</td>
              </tr>
              <tr>
                <td style="border: 1px solid #e2e8f0; padding: 0.5rem;">R&D 인력</td>
                <td style="border: 1px solid #e2e8f0; padding: 0.5rem; text-align: right; color: #6b7280; font-style: italic;">[인력수 입력]</td>
                <td style="border: 1px solid #e2e8f0; padding: 0.5rem; text-align: right; color: #6b7280; font-style: italic;">[인력수 입력]</td>
                <td style="border: 1px solid #e2e8f0; padding: 0.5rem; text-align: right; color: #6b7280; font-style: italic;">[인력수 입력]</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div style="margin-bottom: 1.5rem;">
          <h4 style="font-weight: 500; margin-bottom: 1rem;">3. 지적재산권 현황</h4>
          <div style="background-color: #ede9fe; border: 1px solid #c4b5fd; border-radius: 0.5rem; padding: 1rem;">
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; text-align: center;">
              <div>
                <div style="font-size: 1.5rem; font-weight: bold; color: #7c3aed;">[수량]</div>
                <div style="font-size: 0.875rem; color: #6b7280;">등록 특허</div>
              </div>
              <div>
                <div style="font-size: 1.5rem; font-weight: bold; color: #7c3aed;">[수량]</div>
                <div style="font-size: 0.875rem; color: #6b7280;">출원 특허</div>
              </div>
              <div>
                <div style="font-size: 1.5rem; font-weight: bold; color: #7c3aed;">[수량]</div>
                <div style="font-size: 0.875rem; color: #6b7280;">상표권</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `,
  },
  {
    id: "bio-securities",
    name: "바이오 증권신고서",
    description: "바이오/제약 기업을 위한 전문 증권신고서입니다. 임상시험 정보와 규제 현황이 포함됩니다.",
    category: "바이오",
    features: ["파이프라인", "임상시험", "규제 현황", "연구개발", "시장 전망"],
    htmlContent: () => `
      <div style="text-align: center; margin-bottom: 2rem;">
        <h2 style="font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem; color: #059669;">바이오 증권신고서</h2>
        <div style="font-size: 1.125rem; margin-bottom: 0.5rem;">[회사명]</div>
        <div style="font-size: 1rem;">주식회사 [회사명]</div>
        <div style="font-size: 0.875rem; color: #6b7280; margin-top: 1rem;">🧬 Biotechnology Company</div>
      </div>
      <hr style="border-top: 2px solid #059669; margin: 2rem 0;" />
      <div>
        <h3 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 1rem; color: #059669; border-left: 4px solid #059669; padding-left: 0.75rem;">
          I. 파이프라인 및 개발 현황
        </h3>
        <div style="margin-bottom: 1.5rem;">
          <h4 style="font-weight: 500; margin-bottom: 1rem;">1. 주요 파이프라인</h4>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 1rem;">
            <thead>
              <tr style="background-color: #f0fdf4;">
                <th style="border: 1px solid #bbf7d0; padding: 0.5rem; text-align: left; font-weight: 500;">제품명</th>
                <th style="border: 1px solid #bbf7d0; padding: 0.5rem; text-align: center; font-weight: 500;">적응증</th>
                <th style="border: 1px solid #bbf7d0; padding: 0.5rem; text-align: center; font-weight: 500;">개발단계</th>
                <th style="border: 1px solid #bbf7d0; padding: 0.5rem; text-align: center; font-weight: 500;">예상 출시</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="border: 1px solid #bbf7d0; padding: 0.5rem; color: #6b7280; font-style: italic;">[제품명 입력]</td>
                <td style="border: 1px solid #bbf7d0; padding: 0.5rem; text-align: center; color: #6b7280; font-style: italic;">[적응증 입력]</td>
                <td style="border: 1px solid #bbf7d0; padding: 0.5rem; text-align: center; color: #6b7280; font-style: italic;">[단계 입력]</td>
                <td style="border: 1px solid #bbf7d0; padding: 0.5rem; text-align: center; color: #6b7280; font-style: italic;">[시기 입력]</td>
              </tr>
              <tr>
                <td style="border: 1px solid #bbf7d0; padding: 0.5rem; color: #6b7280; font-style: italic;">[제품명 입력]</td>
                <td style="border: 1px solid #bbf7d0; padding: 0.5rem; text-align: center; color: #6b7280; font-style: italic;">[적응증 입력]</td>
                <td style="border: 1px solid #bbf7d0; padding: 0.5rem; text-align: center; color: #6b7280; font-style: italic;">[단계 입력]</td>
                <td style="border: 1px solid #bbf7d0; padding: 0.5rem; text-align: center; color: #6b7280; font-style: italic;">[시기 입력]</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div style="margin-bottom: 1.5rem;">
          <h4 style="font-weight: 500; margin-bottom: 1rem;">2. 임상시험 현황</h4>
          <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 0.5rem; padding: 1rem;">
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; text-align: center;">
              <div>
                <div style="font-size: 1.25rem; font-weight: bold; color: #059669;">[수량]</div>
                <div style="font-size: 0.875rem; color: #6b7280;">전임상</div>
              </div>
              <div>
                <div style="font-size: 1.25rem; font-weight: bold; color: #059669;">[수량]</div>
                <div style="font-size: 0.875rem; color: #6b7280;">임상 1상</div>
              </div>
              <div>
                <div style="font-size: 1.25rem; font-weight: bold; color: #059669;">[수량]</div>
                <div style="font-size: 0.875rem; color: #6b7280;">임상 2상</div>
              </div>
              <div>
                <div style="font-size: 1.25rem; font-weight: bold; color: #059669;">[수량]</div>
                <div style="font-size: 0.875rem; color: #6b7280;">임상 3상</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `,
  },
]

export function getTemplateById(id: string): DocumentTemplate | undefined {
  return documentTemplates.find((template) => template.id === id)
}

export function getTemplatesByCategory(category: string): DocumentTemplate[] {
  return documentTemplates.filter((template) => template.category === category)
}
