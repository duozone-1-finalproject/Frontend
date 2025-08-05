// 문서 내용을 보기 좋게 포맷팅하는 함수
export function formatDocumentForExport(html: string): string {
  // HTML을 더 읽기 쉬운 텍스트로 변환
  return html
    .replace(/<h1[^>]*>/gi, "\n=== ")
    .replace(/<\/h1>/gi, " ===\n")
    .replace(/<h2[^>]*>/gi, "\n== ")
    .replace(/<\/h2>/gi, " ==\n")
    .replace(/<h3[^>]*>/gi, "\n- ")
    .replace(/<\/h3>/gi, "\n")
    .replace(/<h4[^>]*>/gi, "\n  • ")
    .replace(/<\/h4>/gi, "\n")
    .replace(/<p[^>]*>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<br[^>]*>/gi, "\n")
    .replace(/<hr[^>]*>/gi, "\n" + "=".repeat(50) + "\n")
    .replace(/<div[^>]*>/gi, "\n")
    .replace(/<\/div>/gi, "\n")
    .replace(/<table[^>]*>/gi, "\n[표 시작]\n")
    .replace(/<\/table>/gi, "\n[표 끝]\n")
    .replace(/<tr[^>]*>/gi, "")
    .replace(/<\/tr>/gi, "\n")
    .replace(/<td[^>]*>/gi, "| ")
    .replace(/<\/td>/gi, " ")
    .replace(/<th[^>]*>/gi, "| ")
    .replace(/<\/th>/gi, " ")
    .replace(/<[^>]+>/g, "") // 나머지 HTML 태그 제거
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n\s*\n\s*\n/g, "\n\n") // 연속된 빈 줄을 두 줄로 제한
    .trim()
}
